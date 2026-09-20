# dexbooru-mobile

React Native (Expo SDK 57) client for [Dexbooru](https://github.com/Dexbooru/dexbooru-web). Android and iOS share Expo Router screens, a cookie-jar API client, and React Native Reusables.

## Setup

```bash
npm install
```

API origin is environment-scoped:

- Development (`npm start`): `.env.development` → `http://localhost:5173`
- Production / build (`npm run start:build`, `npm run build`): `.env.production` → `https://dexbooru.neetbyte.fun`

Override on your machine with `.env.local` (gitignored). See `.env.example`.

```bash
npm start
```

Use LAN (the default script). Do **not** pass `--tunnel`: Expo's bundled ngrok client throws `CommandError: TypeError: Cannot read properties of undefined (reading 'body')` when the tunnel API response has no `body`. Same-machine emulator/simulator and `expo start --web` work over LAN. For a physical phone, use the same Wi-Fi as the packager, or your own ngrok/Cloudflare tunnel in front of Metro.

## Production / build mode

Run a minified production JS bundle in Expo Go or a simulator (no native compile):

```bash
npm run start:build
```

Compile and launch a release binary on a chosen platform:

```bash
npm run build                 # android on Linux/Windows, ios on macOS
npm run build -- android
npm run build -- ios          # macOS + Xcode
npm run build -- web          # export ./dist and serve it
```

Android needs a **JDK** (not only a JRE) and a writable SDK. `npm run build -- android` will use `JAVA_HOME` if `javac` is present, otherwise it looks for a system JDK, then bootstraps `~/Android/Sdk` (platform 36 + NDK 27) when `/opt/android-sdk` is missing those packages or is not writable. Extra flags after the platform are forwarded to Expo (`npm run build -- android --device`).

## Architecture

- Routes: `src/app/` (tabs: posts, search, collections, profile)
- API modules: `src/api/` (retries, offset pagination, session cookies)
- Global client state: `src/stores/` (Zustand)
- Server state: TanStack Query
- UI: `src/components/ui/` (React Native Reusables, no Clerk)

Most screens are navigation stubs until their GitHub issues are implemented. Login, logout, and session restore are wired.
