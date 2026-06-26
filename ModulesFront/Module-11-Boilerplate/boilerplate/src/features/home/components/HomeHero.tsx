import { ArrowRightIcon, BoxesIcon, BracesIcon, RouteIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const foundations = [
  {
    title: 'Feature-first structure',
    description:
      'Keep product code grouped by feature, with local API, hooks, stores and types.',
    icon: BoxesIcon,
  },
  {
    title: 'Typed API boundary',
    description:
      'Use a small generic client with typed responses and normalized HTTP errors.',
    icon: BracesIcon,
  },
  {
    title: 'Ready routing layer',
    description:
      'Start with React Router, a shared shell, and a clear place for route providers.',
    icon: RouteIcon,
  },
]

export function HomeHero() {
  return (
    <section className="flex flex-col gap-8">
      <PageHeader
        actions={
          <Button asChild>
            <a href="https://ui.shadcn.com" rel="noreferrer" target="_blank">
              shadcn/ui
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
        }
        description="A neutral React starter for portfolio projects, dashboards, SaaS frontends, and MVPs that need a clean technical base from day one."
        title="Build serious React apps without rebuilding the foundation."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {foundations.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title}>
              <CardHeader>
                <Icon aria-hidden="true" className="mb-2 text-muted-foreground" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Replace this sample content with your first feature, not with global
                  abstractions.
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
