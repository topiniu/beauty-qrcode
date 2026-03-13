import { spawnSync } from 'node:child_process';

const releaseTarget = process.argv[2] || 'patch';
const allowedTargets = new Set(['patch', 'minor', 'major']);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!allowedTargets.has(releaseTarget) && !/^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(releaseTarget)) {
  console.error(
    'Invalid release target. Use patch, minor, major, or an explicit semver version like 0.2.1.'
  );
  process.exit(1);
}

run('npm', ['version', releaseTarget]);
run('npm', ['run', 'test:ci']);
run('npm', ['run', 'build:lib']);
run('npm', ['run', 'pack:check']);
run('npm', ['publish']);
