import { Outlet } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <a className="font-semibold tracking-tight" href="/">
            react-app-starter
          </a>
          <nav aria-label="Primary navigation" className="flex items-center gap-4">
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="https://react.dev"
              rel="noreferrer"
              target="_blank"
            >
              React
            </a>
            <a
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="https://vite.dev"
              rel="noreferrer"
              target="_blank"
            >
              Vite
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <Outlet />
      </main>
      <Separator />
      <footer className="mx-auto flex w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
        Production-minded React starter for serious front-end projects.
      </footer>
    </div>
  )
}
