---
name: add-dexbooru-screen
description: >-
  Fill in an existing Dexbooru mobile screen stub using Expo SDK 57, React Native
  Reusables, cookie-jar API modules, TanStack Query pagination, and Zustand.
  Use when adding or implementing a Dexbooru screen, route, API module, or GitHub
  issue for posts, search, collections, profile, comments, auth, or moderation.
---

# Add a Dexbooru screen

## Always

- Read Expo docs at https://docs.expo.dev/versions/v57.0.0/ before writing code.
- Do not add Clerk. Auth is the `dexbooru-session` cookie jar only.
- Never send `Authorization: Bearer` from `POST /api/users/auth`. That token is 2 minutes and is not accepted by the server.
- Do not scrape SSR HTML. If a flow is form-action/SSR-only, implement against a JSON gap documented in the matching GitHub issue.

## Layout

1. Reuse the existing Expo Router stub under `src/app/` (do not invent a parallel path).
2. Put HTTP in `src/api/<resource>.ts` using `apiJson` / `apiFetch` from `src/api/client.ts`.
3. Register Query keys in `src/api/query-keys.ts`.
4. Use `usePaginatedResource` for offset lists (`pageNumber` starts at 0 except notifications `page` which is 1-based).
5. Put session/prefs/config in Zustand (`src/stores/`). Keep list data in TanStack Query.
6. UI comes from `src/components/ui/*` (React Native Reusables). Add missing pieces with `npx @react-native-reusables/cli@latest add <name>` — never the clerk-auth template.

## Pagination and retries

- Page sizes: posts 27, collections 28, comments 35, labels up to config (~100).
- Empty page or `length < pageSize` ends the infinite query.
- Retries live in `src/api/retry.ts` (429/5xx/network). Query `retry` stays false so we do not double-retry.
- Honor `Retry-After` when present (post likes are rate-limited).

## Envelope

Successful JSON is `{ status, message, data }`. `apiJson` returns `data`.

## Checklist

- [ ] Stub route filled, not duplicated
- [ ] API module matches `~/dev/dexbooru-web/src/lib/client/api` where a JSON route exists
- [ ] Loading, empty, and error states
- [ ] Cookie session for authenticated calls
- [ ] NSFW/blacklist buckets go through `useUiStore` when the screen filters posts
