#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { platform } = require('node:os');
const path = require('node:path');

const { ensureAndroidToolchain } = require('./android-env');

const USAGE = `Usage: npm run build -- [android|ios|web] [extra expo flags...]

  android  Compile a release APK, install, and launch (needs a JDK + Android SDK)
  ios      Compile a Release app, install, and launch (macOS + Xcode only)
  web      Export a production Metro bundle and serve ./dist

If you omit the platform, the script picks android on Linux/Windows and ios on macOS.
`;

function defaultPlatform() {
  return platform() === 'darwin' ? 'ios' : 'android';
}

function productionEnv(extra = process.env) {
  return { ...extra, NODE_ENV: 'production' };
}

function run(command, args, env = productionEnv()) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell: false });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

async function main() {
  const argv = process.argv.slice(2);
  const known = new Set(['android', 'ios', 'web']);
  const platformArg = known.has(argv[0]) ? argv.shift() : defaultPlatform();
  const extra = argv;
  const projectRoot = path.resolve(__dirname, '..');

  if (platformArg === 'ios' && platform() !== 'darwin') {
    console.error(
      'iOS release builds require macOS and Xcode. Use `npm run build -- android` or `npm run build -- web`.',
    );
    process.exit(1);
  }

  if (platformArg === 'android') {
    const env = productionEnv(await ensureAndroidToolchain(projectRoot));
    run('npx', ['expo', 'run:android', '--variant', 'release', ...extra], env);
  }

  if (platformArg === 'ios') {
    run('npx', ['expo', 'run:ios', '--configuration', 'Release', ...extra]);
  }

  if (platformArg === 'web') {
    const exported = spawnSync('npx', ['expo', 'export', '--platform', 'web', ...extra], {
      stdio: 'inherit',
      env: productionEnv(),
      shell: false,
    });
    if (exported.status !== 0) {
      process.exit(exported.status ?? 1);
    }
    console.log('\nServing production web export from ./dist (Ctrl+C to stop)\n');
    run('npx', ['--yes', 'serve', 'dist']);
  }

  console.error(USAGE);
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
