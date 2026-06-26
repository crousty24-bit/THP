# Zgen

Zgen is a mini social network built for the THP React, Jotai, routing, and JWT
authentication exercise. It uses the Shmeeter Strapi API and focuses on a
working login/logout flow, protected routes, profile editing, post creation,
author profiles, likes, and own-post deletion.

The app was refactored from Redux to Jotai for global state management. The
refactor keeps the same visible behavior while simplifying the state layer.

## Features

- Register, login, logout, and refresh-cookie session restoration.
- Protected profile route with `username` and `description` editing.
- Authenticated home timeline with newest-first posts and a composer.
- Author profile route from clickable post usernames.
- Like/unlike support with `null` likes displayed as `0`.
- Delete controls only for posts owned by the connected user.
- Installable PWA shell with manifest, service worker, and app icons.
- Jotai-driven install prompt shown after 3 page visits, then every 2 page
  visits, and every 4 successful posts from the active user.
- Dark X-inspired responsive UI using shadcn/ui, Tailwind v4, and native CSS.

## Jotai State Refactor

The previous Redux store has been replaced by Jotai atoms:

```text
src/store/
  atoms.ts
  authReducer.ts
  postsReducer.ts
  pwaInstallReducer.ts
  hooks.ts
```

`atoms.ts` exposes these reducer atoms:

- `authAtom` stores the current access token, connected user, auth status, and
  auth error.
- `postsAtom` stores the timeline posts, posts loading status, posts error, and
  pending post ids used during like/delete requests.
- `pwaInstallAtom` stores PWA installability, install state, page-visit count,
  active-user post count, and the last notification counters.

The existing reducer logic was intentionally kept in `authReducer.ts` and
`postsReducer.ts`. This makes the refactor smaller and safer: action names such
as `AUTH_SUCCESS`, `AUTH_LOGOUT`, `POSTS_SUCCESS`, and `POSTS_UPSERT` still
describe the same state transitions as before.

Components no longer use Redux hooks such as `useSelector` or `useDispatch`.
They use small app-specific Jotai hooks from `hooks.ts` instead:

```ts
useAuthState()
useAuthDispatch()
usePostsState()
usePostsDispatch()
usePwaInstallState()
usePwaInstallDispatch()
```

The root React provider is now Jotai's `Provider` in `src/main.tsx`. The Redux
store, root reducer, `redux`, and `react-redux` dependencies were removed.

### Why Jotai Here

- Less boilerplate: no root reducer, Redux store setup, or typed Redux selector
  wrappers.
- Smaller dependency surface: global state now depends on Jotai only.
- Local subscriptions: components read only the atom they need, such as auth or
  posts.
- Incremental refactor: keeping reducer atoms preserves the existing action
  model while replacing Redux infrastructure.
- Better fit for this project size: Zgen has small global state domains and
  does not need Redux middleware or a complex store architecture.

## PWA Install Flow

Zgen includes a `manifest.webmanifest`, PNG app icons, and a small service
worker for the app shell. The service worker is registered only in production
builds so local Vite development is not affected by cached files.

The custom install notification depends on the browser's `beforeinstallprompt`
event. When the browser reports that the app is installable, Zgen keeps that
event in memory and lets Jotai decide when to show the in-app notification:

- after 3 page visits, then every 2 additional page visits;
- after every 4 posts successfully created by the active user.

If the app is already installed or running in standalone mode, install
notifications are disabled.

## Authentication Refactor

The app uses the Shmeeter JWT returned by the API, but it does not persist the
JWT in `localStorage` or `sessionStorage`.

Current behavior:

- On login or register, the API response is normalized into `{ accessToken,
  user }` and stored only in Jotai memory state.
- API calls send the access token with the `Authorization: Bearer ...` header.
- `fetch` uses `credentials: 'include'`, so the API can use its refresh cookie
  for session restoration.
- On app startup, `refreshSession()` calls `/auth/refresh`. If it succeeds, the
  in-memory auth atom is restored. If it fails, auth status becomes `idle`.
- When a `401` or `403` is received while refreshing the current user, the app
  clears auth state and asks the user to log in again.
- Logout calls `/auth/logout`, then clears the in-memory auth state and loaded
  posts locally even if the API request fails.

This avoids keeping a long-lived JWT in browser storage. A page refresh clears
the in-memory token, and the app relies on the API refresh endpoint/cookie to
restore a session when available.

## API

The app expects the Shmeeter server at `http://localhost:1337/api` by default.
Override it with:

```bash
VITE_API_ENABLED=true
VITE_API_BASE_URL=http://localhost:1337/api
```

Set `VITE_API_ENABLED=false` to build a static public demo that does not call a
local Shmeeter server. In this mode, API helpers throw a controlled
`API_DISABLED_MESSAGE`, public pages remain renderable, and auth-only actions
are disabled or redirected instead of trying to reach `localhost`.

This is the intended GitHub Pages mode. GitHub Pages cannot reach a developer's
local Shmeeter server, so the public deployment should be built with:

```bash
VITE_API_ENABLED=false
```

Local development should keep the API enabled:

```bash
VITE_API_ENABLED=true
VITE_API_BASE_URL=http://localhost:1337/api
```

Shmeeter repository: <https://github.com/Beygs/shmeeter-server>

The Shmeeter server declares Node `>=16 <=20`. If your local Node version is
newer, run the API with a compatible Node version.

## Setup

```bash
pnpm install
```

## Run

```bash
pnpm run dev
```

## Checks

```bash
pnpm run lint
pnpm run build
```

## Structure

```text
index.html
src/
  api/
    client.ts
  components/
  pages/
  store/
    pwaInstallReducer.ts
  lib/
  types.ts
  App.tsx
  main.tsx
  index.css
```
