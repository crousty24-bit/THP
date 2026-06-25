import { Link } from 'react-router-dom'

import { API_DISABLED_MESSAGE, isApiEnabled } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppSelector } from '@/store/hooks'

export function RightRail() {
  const user = useAppSelector((state) => state.auth.user)
  const postsCount = useAppSelector((state) => state.posts.items.length)

  return (
    <aside className="hidden px-5 py-5 xl:block">
      <div className="sticky top-5 flex flex-col gap-4">
        <Card className="border-border/80 bg-card/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div>
              <p className="text-foreground">{user ? 'Authenticated' : 'Public Mode'}</p>
              <p>
                {user
                  ? 'Access token is held in memory for API requests.'
                  : 'Log in to unlock the timeline.'}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-semibold tabular-nums text-foreground">
                  {postsCount}
                </p>
                <p>loaded posts</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums text-foreground">30</p>
                <p>feed limit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">API</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            {isApiEnabled ? (
              <p>
                Zgen expects the Shmeeter server on{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                  localhost:1337
                </code>
                .
              </p>
            ) : (
              <p>{API_DISABLED_MESSAGE}</p>
            )}
            <Link
              className="w-fit rounded-md text-primary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              to="/profile"
            >
              Check Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
