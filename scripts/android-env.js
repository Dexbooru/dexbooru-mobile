const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const https = require('node:https');

const REQUIRED_SDK_PACKAGES = [
  'platform-tools',
  'platforms;android-36',
  'build-tools;36.0.0',
  'ndk;27.1.12297006',
];

const COMMANDLINE_TOOLS = {
  linux: 'https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip',
  darwin: 'https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip',
  win32: 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip',
};

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasJavac(javaHome) {
  const binary = process.platform === 'win32' ? 'javac.exe' : 'javac';
  return javaHome && exists(path.join(javaHome, 'bin', binary));
}

function findJdkHome() {
  const extra = [];
  extra.push(path.join(os.homedir(), '.local', 'jdk-17'));
  if (process.platform === 'linux') {
    extra.push(
      '/usr/lib/jvm/java-17-openjdk',
      '/usr/lib/jvm/java-21-openjdk',
      '/usr/lib/jvm/java-26-openjdk',
      '/usr/lib/jvm/default',
    );
  }
  if (process.platform === 'darwin') {
    extra.push('/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home');
  }

  const candidates = [process.env.JAVA_HOME, ...extra].filter(Boolean);
  const ranked = candidates
    .filter((home) => hasJavac(home))
    .sort((a, b) => jdkPreference(a) - jdkPreference(b));
  return ranked[0] ?? null;
}

function jdkPreference(javaHome) {
  if (javaHome.includes('17')) return 0;
  if (javaHome.includes('21')) return 1;
  if (javaHome.includes('11')) return 2;
  return 9;
}

const TEMURIN_17 = {
  linux: 'https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse?project=jdk',
  darwin: 'https://api.adoptium.net/v3/binary/latest/17/ga/mac/x64/jdk/hotspot/normal/eclipse?project=jdk',
};

async function ensureJdk17() {
  const existing = findJdkHome();
  if (existing && jdkPreference(existing) <= 1) return existing;

  const dest = path.join(os.homedir(), '.local', 'jdk-17');
  if (hasJavac(dest)) return dest;

  const url = TEMURIN_17[process.platform];
  if (!url) {
    throw new Error(
      'Android Gradle Plugin needs JDK 17. Install Temurin/OpenJDK 17 and set JAVA_HOME.',
    );
  }

  console.log('Downloading Temurin JDK 17 (Android Gradle does not support this machine’s default JRE/JDK 25+)…');
  const archive = path.join(os.tmpdir(), process.platform === 'linux' ? 'jdk17.tar.gz' : 'jdk17.tar.gz');
  await download(url, archive);
  fs.mkdirSync(path.join(os.homedir(), '.local'), { recursive: true });
  const extractRoot = path.join(os.tmpdir(), `jdk17-extract-${Date.now()}`);
  fs.mkdirSync(extractRoot, { recursive: true });
  run('tar', ['-xzf', archive, '-C', extractRoot], process.env);
  const unpacked = fs.readdirSync(extractRoot).map((name) => path.join(extractRoot, name)).find((dir) => hasJavac(dir));
  if (!unpacked) {
    throw new Error('Failed to unpack JDK 17');
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(unpacked, dest, { recursive: true });
  fs.rmSync(extractRoot, { recursive: true, force: true });
  return dest;
}

function sdkLooksComplete(sdkRoot) {
  return exists(path.join(sdkRoot, 'ndk', '27.1.12297006'));
}

function sdkIsWritable(sdkRoot) {
  try {
    fs.mkdirSync(sdkRoot, { recursive: true });
    fs.accessSync(sdkRoot, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveSdkRoot() {
  const userSdk = path.join(os.homedir(), 'Android', 'Sdk');
  const preferred = [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT, userSdk].filter(Boolean);
  const complete = preferred.find((root) => sdkLooksComplete(root));
  if (complete) return complete;
  const writable = preferred.find((root) => sdkIsWritable(root));
  return writable ?? userSdk;
}

function run(command, args, env) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell: false });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with code ${result.status}`);
  }
}

function extractZip(zipPath, dest, env) {
  fs.mkdirSync(dest, { recursive: true });
  if (process.platform === 'win32') {
    run('tar', ['-xf', zipPath, '-C', dest], env);
    return;
  }
  const unzip = spawnSync('unzip', ['-q', '-o', zipPath, '-d', dest], { stdio: 'inherit', env });
  if (unzip.status === 0) return;
  run('python3', ['-c', 'import zipfile,sys; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])', zipPath, dest], env);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close();
          fs.unlink(dest, () => undefined);
          const next = new URL(response.headers.location, url).toString();
          download(next, dest).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => undefined);
          reject(new Error(`Download failed ${response.statusCode} ${url}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', reject);
  });
}

async function ensureCmdlineTools(sdkRoot, env) {
  const sdkmanager = path.join(
    sdkRoot,
    'cmdline-tools',
    'latest',
    'bin',
    process.platform === 'win32' ? 'sdkmanager.bat' : 'sdkmanager',
  );
  if (exists(sdkmanager)) return sdkmanager;

  const url = COMMANDLINE_TOOLS[process.platform];
  if (!url) {
    throw new Error(`No Android command-line tools URL for platform ${process.platform}`);
  }

  console.log('Downloading Android command-line tools…');
  const zipPath = path.join(os.tmpdir(), 'commandlinetools.zip');
  await download(url, zipPath);

  const extractDir = path.join(sdkRoot, 'cmdline-tools');
  extractZip(zipPath, extractDir, env);

  const unpacked = path.join(extractDir, 'cmdline-tools');
  const latest = path.join(extractDir, 'latest');
  if (exists(unpacked) && !exists(latest)) {
    fs.renameSync(unpacked, latest);
  }
  if (!exists(sdkmanager)) {
    throw new Error(`sdkmanager not found at ${sdkmanager} after unpacking command-line tools`);
  }
  return sdkmanager;
}

function writeLocalProperties(projectRoot, sdkRoot) {
  const filePath = path.join(projectRoot, 'android', 'local.properties');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `sdk.dir=${sdkRoot.replaceAll('\\', '\\\\')}\n`);
}

async function ensureAndroidToolchain(projectRoot) {
  const javaHome = await ensureJdk17();
  if (!javaHome) {
    throw new Error(
      'A JDK 17 installation is required for Android release builds. Install Temurin/OpenJDK 17 and set JAVA_HOME.',
    );
  }

  const sdkRoot = resolveSdkRoot();
  if (!sdkIsWritable(sdkRoot)) {
    throw new Error(
      `Android SDK at ${sdkRoot} is not writable. Set ANDROID_HOME to a user-owned SDK (commonly ~/Android/Sdk) or install Android Studio.`,
    );
  }

  const env = {
    ...process.env,
    JAVA_HOME: javaHome,
    ANDROID_HOME: sdkRoot,
    ANDROID_SDK_ROOT: sdkRoot,
    PATH: `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
  };

  if (!sdkLooksComplete(sdkRoot)) {
    const sdkmanager = await ensureCmdlineTools(sdkRoot, env);
    console.log('Accepting Android SDK licenses and installing platform 36 + NDK 27…');
    const license = spawnSync('bash', ['-lc', `yes | "${sdkmanager}" --sdk_root="${sdkRoot}" --licenses`], {
      stdio: 'inherit',
      env,
    });
    if (license.status !== 0) {
      console.warn('sdkmanager --licenses exited non-zero; continuing with package install.');
    }
    run(sdkmanager, [`--sdk_root=${sdkRoot}`, ...REQUIRED_SDK_PACKAGES], env);
  }

  writeLocalProperties(projectRoot, sdkRoot);
  console.log(`Using JDK ${javaHome}`);
  console.log(`Using Android SDK ${sdkRoot}`);
  return env;
}

module.exports = { ensureAndroidToolchain, findJdkHome };
