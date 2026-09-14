const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  assertWithinCeiling,
  fetchReleases,
  impliedBump,
  nextVersion,
  notesBaseline,
  previousTag,
  resolveLineage,
} = require('../../scripts/release-lineage');

const SCRIPT = path.resolve(__dirname, '../../scripts/release-lineage.js');

jest.setTimeout(30000);

const tempDirs: string[] = [];

const tempDir = (prefix: string) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));

  tempDirs.push(dir);

  return dir;
};

const git = (cwd: string, args: string[]) =>
  execFileSync(
    'git',
    ['-c', 'user.email=dev@basistheory.com', '-c', 'user.name=dev', ...args],
    { cwd, stdio: 'pipe', encoding: 'utf-8' }
  );

/**
 * A repo shaped like this one: a master line carrying v1 tags, and a v3 tag on a
 * branch master cannot reach.
 */
const makeRepo = () => {
  const dir = tempDir('lineage-');

  git(dir, ['init', '--quiet', '--initial-branch=master', '.']);
  git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'chore: init']);
  git(dir, ['tag', 'v1.126.6']);
  git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'fix: something']);
  git(dir, ['tag', 'v1.126.7']);

  git(dir, ['checkout', '--quiet', '-b', 'next']);
  git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'feat!: v3']);
  git(dir, ['tag', 'v3.0.0']);
  git(dir, ['checkout', '--quiet', 'master']);
  git(dir, [
    'commit',
    '--allow-empty',
    '--quiet',
    '-m',
    'fix: pending release',
  ]);

  return dir;
};

const reachableTags = (dir: string) =>
  git(dir, ['tag', '--merged', 'HEAD']).split('\n').filter(Boolean);

afterAll(() => {
  tempDirs.forEach((dir) => fs.rmSync(dir, { force: true, recursive: true }));
});

describe('previousTag', () => {
  test('takes the newest version tag, not the newest by date', () => {
    expect(previousTag(['v1.9.0', 'v1.126.7', 'v1.126.6'])).toBe('v1.126.7');
  });

  test('ignores tags that are not plain vX.Y.Z', () => {
    expect(
      previousTag(['v1.0.0-9cbefed', '1.0.0-beta.1', 'not-a-tag', 'v1.126.7'])
    ).toBe('v1.126.7');
  });

  test('returns null when nothing qualifies', () => {
    expect(previousTag([])).toBeNull();
    expect(previousTag(['latest', 'v1.0.0-beta.1'])).toBeNull();
  });

  // The reason this function exists: v3.0.0 sorts above every v1 tag, so the only
  // thing keeping master off the v3 line is being handed reachable tags.
  test('a v3 tag would win if it were reachable, so the caller must scope by ancestry', () => {
    expect(previousTag(['v1.126.7', 'v3.0.0'])).toBe('v3.0.0');
  });

  test('git ancestry excludes the other branch, which is what scopes it', () => {
    const dir = makeRepo();

    expect(reachableTags(dir)).toEqual(['v1.126.6', 'v1.126.7']);
    expect(previousTag(reachableTags(dir))).toBe('v1.126.7');
  });
});

describe('impliedBump', () => {
  test('feat is a minor', () => {
    expect(impliedBump(['feat: add a thing'], ['feat: add a thing'])).toBe(
      'minor'
    );
    expect(impliedBump(['feat(cards): add a thing'], [])).toBe('minor');
  });

  test('a bang on any type is a major', () => {
    expect(impliedBump(['feat!: drop a thing'], [])).toBe('major');
    expect(impliedBump(['chore(deps)!: drop node 18'], [])).toBe('major');
  });

  test('a stray bang elsewhere in the subject is not a major', () => {
    expect(
      impliedBump(['fix: stop the crash!'], ['fix: stop the crash!'])
    ).toBe('patch');
  });

  test('a BREAKING CHANGE footer in the body is a major', () => {
    const message =
      'feat: new api\n\nBREAKING CHANGE: mount() returns a promise';

    expect(impliedBump(['feat: new api'], [message])).toBe('major');
    expect(
      impliedBump(['feat: new api'], ['feat: new api\n\nBREAKING-CHANGE: same'])
    ).toBe('major');
  });

  test('the marker has to start a line', () => {
    const message = 'docs: explain what BREAKING CHANGE: means here';

    expect(impliedBump(['docs: explain'], [message])).toBe('patch');
  });

  test('anything else is a patch, matching the action default_bump', () => {
    expect(impliedBump(['chore: tidy up', 'docs: a note'], [])).toBe('patch');
    expect(impliedBump([], [])).toBe('patch');
  });

  test('the strongest bump in the range wins', () => {
    expect(impliedBump(['chore: a', 'feat: b', 'fix: c'], [])).toBe('minor');
    expect(impliedBump(['chore: a', 'feat: b', 'fix!: c'], [])).toBe('major');
  });
});

describe('nextVersion', () => {
  test('mirrors the increment rules the release script uses', () => {
    expect(nextVersion('v1.126.7', 'patch')).toBe('1.126.8');
    expect(nextVersion('v1.126.7', 'minor')).toBe('1.127.0');
    expect(nextVersion('v1.126.7', 'major')).toBe('2.0.0');
  });

  test('returns a bare version, since the action applies its own tag_prefix', () => {
    expect(nextVersion('v1.126.7', 'patch')).not.toMatch(/^v/);
  });

  test('refuses a tag it cannot parse', () => {
    expect(() => nextVersion('v1.0.0-beta.1', 'patch')).toThrow(
      /not a v<major>/
    );
    expect(() => nextVersion(undefined, 'patch')).toThrow(/not a v<major>/);
  });
});

describe('assertWithinCeiling', () => {
  test('allows the line this branch releases on', () => {
    expect(() => assertWithinCeiling('1.126.8', 2)).not.toThrow();
    expect(() => assertWithinCeiling('2.0.0', 2)).not.toThrow();
  });

  test('rejects a version past the ceiling', () => {
    expect(() => assertWithinCeiling('3.1.0', 2)).toThrow(/past the v2 line/);
  });

  test('rejects a version it cannot read', () => {
    expect(() => assertWithinCeiling('not-a-version', 2)).toThrow(
      /not a valid version/
    );
  });
});

describe('notesBaseline', () => {
  const reachable = () => true;

  test('skips prereleases, so notes span everything since the last promotion', () => {
    const releases = [
      { tag_name: 'v1.126.7', prerelease: true, draft: false },
      { tag_name: 'v1.126.6', prerelease: true, draft: false },
      { tag_name: 'v1.126.4', prerelease: false, draft: false },
    ];

    expect(notesBaseline(releases, reachable)).toBe('v1.126.4');
  });

  test('skips drafts', () => {
    const releases = [
      { tag_name: 'v1.126.7', prerelease: false, draft: true },
      { tag_name: 'v1.126.4', prerelease: false, draft: false },
    ];

    expect(notesBaseline(releases, reachable)).toBe('v1.126.4');
  });

  // v3.0.0 is a promoted, non-draft release, and it is the newest one. Only the
  // reachability check keeps it from becoming master's baseline.
  test('skips a promoted release this commit cannot reach', () => {
    const releases = [
      { tag_name: 'v3.0.0', prerelease: false, draft: false },
      { tag_name: 'v1.126.4', prerelease: false, draft: false },
    ];

    expect(notesBaseline(releases, (tag: string) => tag !== 'v3.0.0')).toBe(
      'v1.126.4'
    );
  });

  test('null when nothing promoted is reachable, so the caller omits the parameter', () => {
    const releases = [{ tag_name: 'v1.126.7', prerelease: true, draft: false }];

    expect(notesBaseline(releases, reachable)).toBeNull();
    expect(notesBaseline([], reachable)).toBeNull();
  });
});

describe('fetchReleases', () => {
  test('combines every paginated release page before choosing a baseline', () => {
    const releases = [
      { tag_name: 'v1.126.7', prerelease: true, draft: false },
      { tag_name: 'v1.126.4', prerelease: false, draft: false },
    ];
    const run = jest
      .fn()
      .mockReturnValue(releases.map(JSON.stringify).join('\n'));

    expect(fetchReleases('Basis-Theory/basistheory-elements', run)).toEqual(
      releases
    );
    expect(run).toHaveBeenCalledWith('gh', [
      'api',
      'repos/Basis-Theory/basistheory-elements/releases?per_page=100',
      '--paginate',
      '--jq',
      '.[] | {tag_name, prerelease, draft} | @json',
    ]);
    expect(notesBaseline(releases, () => true)).toBe('v1.126.4');
  });
});

describe('resolveLineage', () => {
  const base = {
    tags: ['v1.126.7'],
    subjects: ['chore: a thing'],
    messages: ['chore: a thing'],
    releases: [{ tag_name: 'v1.126.4', prerelease: false, draft: false }],
    isReachable: () => true,
    maxMajor: 2,
  };

  test('resolves the whole lineage for a chore-only range', () => {
    expect(resolveLineage(base)).toEqual({
      baseline: 'v1.126.4',
      bump: 'patch',
      previousTag: 'v1.126.7',
      version: '1.126.8',
    });
  });

  test('refuses to guess when no version tag is reachable', () => {
    expect(() => resolveLineage({ ...base, tags: [] })).toThrow(/no v<major>/);
  });

  test('the ceiling applies to the derived version, not the previous tag', () => {
    expect(() =>
      resolveLineage({
        ...base,
        tags: ['v2.9.9'],
        subjects: ['feat!: break it'],
      })
    ).toThrow(/past the v2 line/);
  });
});

describe('the script end to end', () => {
  // No GITHUB_REPOSITORY, so it resolves the version from git alone and reports no
  // baseline. That is the half that decides what gets tagged.
  const runScript = (cwd: string) => {
    const { GITHUB_REPOSITORY, GITHUB_OUTPUT, ...env } = process.env;

    return execFileSync('node', [SCRIPT, '--json'], {
      cwd,
      encoding: 'utf-8',
      env: { ...env, MAX_MAJOR: '2' },
      stdio: 'pipe',
    });
  };

  test('derives the next v1 tag on master and ignores the unreachable v3 tag', () => {
    const dir = makeRepo();
    const output = runScript(dir);

    expect(output).toContain('Previous tag on this branch: v1.126.7');
    expect(output).toContain('Version: 1.126.8');
    expect(output).not.toContain('3.');
  });

  test('a feat in the range moves the minor', () => {
    const dir = makeRepo();

    git(dir, [
      'commit',
      '--allow-empty',
      '--quiet',
      '-m',
      'feat: something new',
    ]);

    expect(runScript(dir)).toContain('Version: 1.127.0');
  });

  test('reuses a version tag already pointing at HEAD on retry', () => {
    const dir = makeRepo();

    git(dir, ['tag', 'v1.126.8']);

    const output = runScript(dir);

    expect(output).toContain('Reusing version tag already at HEAD: v1.126.8');
    expect(output).toContain('Version: 1.126.8');
    expect(output).not.toContain('1.126.9');
  });

  test('skips an older commit already superseded by a descendant tag', () => {
    const dir = makeRepo();
    const olderCommit = git(dir, ['rev-parse', 'HEAD']).trim();

    git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'fix: newer deploy']);
    git(dir, ['tag', 'v1.126.8']);
    git(dir, ['checkout', '--quiet', olderCommit]);

    const output = runScript(dir);

    expect(output).toContain('superseded by descendant tag v1.126.8');
    expect(output).toContain('"skip": true');
  });

  test('fails closed when the expected next tag points elsewhere', () => {
    const dir = makeRepo();

    git(dir, ['checkout', '--quiet', '-b', 'collision', 'v1.126.7']);
    git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'fix: other commit']);
    git(dir, ['tag', 'v1.126.8']);
    git(dir, ['checkout', '--quiet', 'master']);

    expect(() => runScript(dir)).toThrow(/already points at another commit/);
  });

  test('writes the version and baseline to GITHUB_OUTPUT', () => {
    const dir = makeRepo();
    const outputFile = path.join(tempDir('lineage-out-'), 'output.txt');
    const { GITHUB_REPOSITORY, ...env } = process.env;

    execFileSync('node', [SCRIPT], {
      cwd: dir,
      encoding: 'utf-8',
      env: { ...env, GITHUB_OUTPUT: outputFile, MAX_MAJOR: '2' },
      stdio: 'pipe',
    });

    const written = fs.readFileSync(outputFile, 'utf-8');

    expect(written).toContain('version=1.126.8');
    expect(written).toContain('tag=v1.126.8');
    expect(written).toContain('skip=false');
    expect(written).toContain('existing_tag=false');
    // Empty rather than absent: the workflow tests the value to decide whether to
    // pass previous_tag_name at all.
    expect(written).toContain('baseline=');
  });

  test('fails loudly when the repo has no version tag to build on', () => {
    const dir = tempDir('lineage-bare-');

    git(dir, ['init', '--quiet', '--initial-branch=master', '.']);
    git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'chore: init']);

    expect(() => runScript(dir)).toThrow(/no v<major>/);
  });

  // Ancestry is the primary guard; this is the case it cannot cover, where a v3
  // tag becomes reachable from this branch through a merge.
  test('the ceiling stops a reachable v3 tag from carrying the branch past v2', () => {
    const dir = tempDir('lineage-v3-');

    git(dir, ['init', '--quiet', '--initial-branch=master', '.']);
    git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'chore: init']);
    git(dir, ['tag', 'v3.0.0']);
    git(dir, ['commit', '--allow-empty', '--quiet', '-m', 'fix: a thing']);

    expect(() => runScript(dir)).toThrow(/past the v2 line/);
  });
});
