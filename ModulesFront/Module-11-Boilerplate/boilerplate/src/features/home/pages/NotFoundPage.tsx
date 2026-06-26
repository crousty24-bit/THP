import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[50svh] flex-col justify-center gap-6">
      <PageHeader
        description="The route does not exist in this starter. Add new pages in a feature folder and register them in the app router."
        title="Page not found"
      />
      <div>
        <Button asChild variant="outline">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </section>
  )
}
