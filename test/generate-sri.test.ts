const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Import functions to test
const {
  generateSriHash,
  compareVersions,
  getVersion,
  readManifest,
  addVersionHash,
  writeManifest,
  printHistory,
} = require('../../scripts/web-elements/generate-sri');

// Console capture for testing output
let consoleMessages: string[] = [];
let consoleErrors: string[] = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Creates a temporary directory for test files
async function createTempDir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'sri-test-'));
}

// Sets up a test environment with required file structure
async function setupTestEnv(tempDir: string) {
  const webElementsDir = path.join(tempDir, 'web-elements');
  const bundleDir = path.join(webElementsDir, 'dist/bundle');
  const srcDir = path.join(webElementsDir, 'src');
  const manifestPath = path.join(webElementsDir, 'sri.json');

  await fs.mkdir(bundleDir, { recursive: true });
  await fs.mkdir(srcDir, { recursive: true });

  // Create version.js with test version
  await fs.writeFile(
    path.join(srcDir, 'version.js'),
    'const version = "1.8.0";\n\nmodule.exports = { version };'
  );

  // Create package.json with fallback version
  await fs.writeFile(
    path.join(webElementsDir, 'package.json'),
    JSON.stringify({ version: '1.7.0' })
  );

  // Create test bundle file
  await fs.writeFile(
    path.join(bundleDir, 'index.js'),
    'console.log("test bundle");'
  );

  return { webElementsDir, bundleDir, srcDir, manifestPath };
}

describe('SRI Hash Generator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    consoleMessages = [];
    consoleErrors = [];

    console.log = (message: string) => consoleMessages.push(message);
    console.error = (message: string) => consoleErrors.push(message);
  });

  afterEach(async () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  // UNIT TESTS

  test('generateSriHash produces correct hash format', () => {
    const content = 'test content';
    const hash = generateSriHash(content);

    expect(hash).toMatch(/^sha384-[A-Za-z0-9+/=]+$/);

    // Verify hash against independent calculation
    const expectedHash =
      'sha384-' + crypto.createHash('sha384').update(content).digest('base64');
    expect(hash).toBe(expectedHash);
  });

  test('compareVersions correctly orders version numbers', () => {
    // Test cases as [a, b, expectedResult]
    const testCases = [
      ['1.0.0', '1.0.0', 0], // Equal
      ['2.0.0', '1.0.0', 1], // Higher major
      ['1.0.0', '2.0.0', -1], // Lower major
      ['1.2.0', '1.1.0', 1], // Higher minor
      ['1.0.0', '1.0.1', -1], // Lower patch
      ['1.0', '1.0.0', 0], // Different length
    ];

    testCases.forEach(([a, b, expected]) => {
      expect(compareVersions(a as string, b as string)).toBe(expected);
    });
  });

  test('getVersion reads from version.js', async () => {
    const { webElementsDir } = await setupTestEnv(tempDir);

    // Mock require to prevent file system lookups
    const originalRequire = require;
    global.require = (id: string) => {
      if (id.endsWith('version.js')) {
        return { version: '1.8.0' };
      }
      return originalRequire(id);
    };

    try {
      const version = await getVersion(webElementsDir);
      expect(version).toBe('1.8.0');
    } finally {
      global.require = originalRequire;
    }
  });

  test('getVersion falls back to package.json', async () => {
    const { webElementsDir, srcDir } = await setupTestEnv(tempDir);

    // Remove version.js to force fallback
    await fs.unlink(path.join(srcDir, 'version.js'));

    const version = await getVersion(webElementsDir);
    expect(version).toBe('1.7.0');
  });

  test('readManifest handles new and existing manifests', async () => {
    // Test new manifest creation
    let manifestPath = path.join(tempDir, 'new-manifest.json');
    let manifest = await readManifest(manifestPath);

    expect(manifest).toHaveProperty('updated');
    expect(manifest).toHaveProperty('integrityHashes');
    expect(Object.keys(manifest.integrityHashes)).toHaveLength(0);

    // Test reading existing manifest
    manifestPath = path.join(tempDir, 'existing-manifest.json');
    const existingData = {
      updated: '2023-01-01T00:00:00.000Z',
      integrityHashes: { '1.0.0': 'sha384-TestHash' },
    };

    await fs.writeFile(manifestPath, JSON.stringify(existingData));
    manifest = await readManifest(manifestPath);

    expect(manifest.integrityHashes['1.0.0']).toBe('sha384-TestHash');
  });

  test('addVersionHash updates manifest correctly', () => {
    const manifest = {
      updated: '2023-01-01T00:00:00.000Z',
      integrityHashes: { '1.0.0': 'sha384-ExistingHash' },
    };

    // Adding new version
    const updated1 = addVersionHash(manifest, '1.1.0', 'sha384-NewHash');
    expect(updated1.integrityHashes['1.0.0']).toBe('sha384-ExistingHash');
    expect(updated1.integrityHashes['1.1.0']).toBe('sha384-NewHash');

    // Updating existing version
    const updated2 = addVersionHash(manifest, '1.0.0', 'sha384-UpdatedHash');
    expect(updated2.integrityHashes['1.0.0']).toBe('sha384-UpdatedHash');
  });

  test('writeManifest saves manifest to file system', async () => {
    const manifestPath = path.join(tempDir, 'write-test.json');
    const manifest = {
      updated: '2023-01-01T00:00:00.000Z',
      integrityHashes: { '1.0.0': 'sha384-TestHash' },
    };

    await writeManifest(manifestPath, manifest);

    const content = await fs.readFile(manifestPath, 'utf8');
    const parsed = JSON.parse(content);

    expect(parsed.updated).toBe('2023-01-01T00:00:00.000Z');
    expect(parsed.integrityHashes['1.0.0']).toBe('sha384-TestHash');
  });

  // INTEGRATION TEST

  test('full script execution workflow', async () => {
    const { webElementsDir, bundleDir, manifestPath } = await setupTestEnv(
      tempDir
    );

    // Setup existing manifest with prior version
    const existingManifest = {
      updated: '2023-01-01T00:00:00.000Z',
      integrityHashes: { '1.0.0': 'sha384-OldHash' },
    };
    await fs.writeFile(manifestPath, JSON.stringify(existingManifest));

    // Mock version.js require
    const originalRequire = require;
    global.require = (id: string) => {
      if (id.endsWith('version.js')) {
        return { version: '1.8.0' };
      }
      return originalRequire(id);
    };

    try {
      // Test end-to-end workflow
      const version = await getVersion(webElementsDir);
      expect(version).toBe('1.8.0');

      const bundleContent = await fs.readFile(path.join(bundleDir, 'index.js'));
      const hash = generateSriHash(bundleContent);
      expect(hash).toMatch(/^sha384-/);

      let manifest = await readManifest(manifestPath);
      expect(manifest.integrityHashes['1.0.0']).toBe('sha384-OldHash');

      manifest = addVersionHash(manifest, version, hash);
      expect(manifest.integrityHashes['1.8.0']).toBe(hash);

      await writeManifest(manifestPath, manifest);

      // Verify final manifest contains both versions
      const finalManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      expect(finalManifest.integrityHashes['1.0.0']).toBe('sha384-OldHash');
      expect(finalManifest.integrityHashes['1.8.0']).toBe(hash);
    } finally {
      global.require = originalRequire;
    }
  });
});
