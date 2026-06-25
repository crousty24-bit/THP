# Zgen

Zgen is a mini social network built for the THP React, Redux, routing, and JWT
authentication exercise. It uses the Shmeeter Strapi API and focuses on a
working login/logout flow, protected routes, profile editing, post creation,
author profiles, likes, and own-post deletion.

## Features

- Register, login, logout, and persisted JWT session state.
- Protected profile route with `username` and `description` editing.
- Authenticated home timeline with newest-first posts and a composer.
- Author profile route from clickable post usernames.
- Like/unlike support with `null` likes displayed as `0`.
- Delete controls only for posts owned by the connected user.
- Dark X-inspired responsive UI using shadcn/ui, Tailwind v4, and native CSS.

## API

The app expects the Shmeeter server at `http://localhost:1337/api` by default.
Override it with:

```bash
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
  lib/
  types.ts
  App.tsx
  main.tsx
  index.css
```
