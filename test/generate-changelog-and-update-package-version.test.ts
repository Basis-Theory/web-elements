const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SCRIPT = path.resolve(
  __dirname,
  '../../scripts/web-elements/generate-changelog-and-update-package-version.sh'
);

jest.setTimeout(30000);

const tempDirs: string[] = [];

const tempDir = (prefix: string) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));

  tempDirs.push(dir);

  return dir;
};

const git = (cwd: string, args: string[], env = {}) =>
  execFileSync(
    'git',
    ['-c', 'user.email=dev@basistheory.com', '-c', 'user.name=dev', ...args],
    { cwd, stdio: 'pipe', env: { ...process.env, ...env } }
  );

// Stands in for the public web-elements repo the script clones to find the last release.
const makeMirror = (tags: string[]) => {
  const mirror = tempDir('we-mirror-');

  git(mirror, ['init', '--quiet', '--initial-branch=main', '.']);
  git(mirror, ['commit', '--allow-empty', '--quiet', '-m', 'init']);
  tags.forEach((tag, index) =>
    git(mirror, ['tag', '-a', tag, '-m', tag], {
      GIT_COMMITTER_DATE: `2026-01-0${index + 1}T00:00:00Z`,
    })
  );

  return mirror;
};

const makeSandbox = (subject: string) => {
  const sandbox = tempDir('we-sandbox-');

  fs.mkdirSync(path.join(sandbox, 'web-elements'));
  fs.writeFileSync(
    path.join(sandbox, 'web-elements/package.json'),
    JSON.stringify({ name: '@basis-theory/web-elements', version: '0.0.0' })
  );

  git(sandbox, ['init', '--quiet', '--initial-branch=main', '.']);
  git(sandbox, ['add', '.']);
  git(sandbox, [
    'commit',
    '--quiet',
    '-m',
    'chore(release): web-elements 2.15.0 [skip ci]',
  ]);
  git(sandbox, ['commit', '--allow-empty', '--quiet', '-m', subject]);

  return sandbox;
};

const runRelease = (subject: string, tags: string[]) => {
  const sandbox = makeSandbox(subject);
  let exitCode = 0;

  try {
    execFileSync('bash', [SCRIPT], {
      cwd: sandbox,
      stdio: 'pipe',
      env: { ...process.env, REMOTE_REPO: makeMirror(tags) },
    });
  } catch (error) {
    exitCode = (error as { status: number }).status;
  }

  const { version } = JSON.parse(
    fs.readFileSync(path.join(sandbox, 'web-elements/package.json'), 'utf8')
  );

  return { exitCode, version };
};

afterAll(() =>
  tempDirs.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true }))
);

describe('generate-changelog-and-update-package-version', () => {
  const tags = ['2.9.0', '2.15.0'];

  test('treats a stray "!" as a patch rather than a major', () => {
    expect(runRelease("fix: don't drop the card brand!", tags)).toEqual({
      exitCode: 0,
      version: '2.15.1',
    });
  });

  test('releases an ordinary 2.x version', () => {
    expect(runRelease('feat(cards): add co-badge support', tags)).toEqual({
      exitCode: 0,
      version: '2.16.0',
    });
  });

  test('fails without writing a version when the bump reaches 3.0.0', () => {
    expect(runRelease('feat!: drop legacy tokenize', tags)).toEqual({
      exitCode: 1,
      version: '0.0.0',
    });
  });

  test('ignores a v3 tag on the public repo', () => {
    expect(
      runRelease('fix(cards): correct luhn check', ['2.15.0', '3.0.0'])
    ).toEqual({ exitCode: 0, version: '2.15.1' });
  });
});
