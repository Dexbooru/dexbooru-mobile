# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Product

Dexbooru mobile is an Expo Router client for the SvelteKit app in `~/dev/dexbooru-web`. Feature screens are issue-driven; fill stubs with the `add-dexbooru-screen` skill.

## Design system

React Native Reusables + NativeWind v4. No Clerk. Add components with:

```bash
npx @react-native-reusables/cli@latest add <component>
```

Root layout must import `src/global.css` and render `PortalHost`.

## Auth

Cookie jar only (`dexbooru-session`, persisted with SecureStore). Login posts the `/login` form action with `redirect: 'manual'` so `Set-Cookie` is kept. Hydrate with `GET /api/users/self`. Logout `GET /profile/logout`. Do not use `POST /api/users/auth` Bearer tokens.

## State

- Server lists: TanStack Query (`src/hooks/use-paginated-resource.ts`)
- Session / preferences / instance config: Zustand (`src/stores/`)
- HTTP: `src/api/client.ts` (Origin header, cookie attach, envelope parse, retries)

## API base

`EXPO_PUBLIC_API_URL` (see `.env.example`). Default `http://localhost:5173`.

Start the bundler with `npm start` (LAN). Do not use `expo start --tunnel`; Expo's ngrok wrapper crashes with `CommandError` … `reading 'body'` when the tunnel API omits `error.body`.
