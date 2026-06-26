# react-app-starter

A production-minded React starter for portfolio projects, dashboards, SaaS
frontends, and MVPs.

## Stack

- React 19 with TypeScript
- Vite with relative asset paths for subfolder deployments
- Tailwind CSS v4
- shadcn/ui primitives
- Jotai for small global state
- React Router
- Generic typed API client
- pnpm
- ESLint, Biome, Vitest, and Testing Library

## Setup

```bash
pnpm install
```

Copy the example environment file when an API base URL is needed:

```bash
cp .env.example .env.local
```

## Run

```bash
pnpm dev
```

## Checks

```bash
pnpm lint
pnpm test:run
pnpm build
pnpm check
```

## Format

```bash
pnpm format
```

## Structure

```text
src/
  app/          App composition, router, and providers.
  components/   Shared layout and UI primitives only.
  features/     Feature-owned pages, components, hooks, stores, APIs, and types.
  hooks/        Shared React hooks.
  lib/          API client, env helpers, router paths, and pure utilities.
  stores/       Shared Jotai atoms.
  styles/       Global Tailwind and theme tokens.
  test/         Testing setup and render helpers.
  types/        Shared TypeScript utility types.
```

## API Client

Set the base URL with:

```text
VITE_API_BASE_URL=https://api.example.com
```

The client is available from `src/lib/api/client.ts`:

```ts
apiClient.get<T>('/resource')
apiClient.post<T>('/resource', payload)
apiClient.put<T>('/resource/1', payload)
apiClient.patch<T>('/resource/1', payload)
apiClient.delete<T>('/resource/1')
```

HTTP failures throw `ApiError` with `status`, `message`, and the optional parsed
payload.

## Feature Convention

Keep product code inside feature folders:

```text
src/features/example/
  api/
  components/
  hooks/
  pages/
  stores/
  types/
```

Only move code to `src/components`, `src/hooks`, `src/lib`, `src/stores`, or
`src/types` when it is genuinely shared across features.
