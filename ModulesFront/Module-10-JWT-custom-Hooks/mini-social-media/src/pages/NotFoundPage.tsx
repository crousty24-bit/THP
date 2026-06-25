import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-md flex-col justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-4xl font-semibold tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground">This Zgen route does not exist.</p>
      </div>
      <Button asChild>
        <Link to="/">Back Home</Link>
      </Button>
    </section>
  )
}
