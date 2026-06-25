import { Home, LogIn, LogOut, User, UserPlus } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { logout } from '@/api/client'
import { BrandMark } from '@/components/BrandMark'
import { RightRail } from '@/components/RightRail'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthDispatch, useAuthState, usePostsDispatch } from '@/store/hooks'

const navLinkBase =
  'flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50'

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function AppLayout() {
  const dispatchAuth = useAuthDispatch()
  const dispatchPosts = usePostsDispatch()
  const navigate = useNavigate()
  const { user } = useAuthState()
  const isAuthenticated = Boolean(user)

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Local logout should still clear in-memory auth if the API is unavailable.
    }

    dispatchAuth({ type: 'AUTH_LOGOUT' })
    dispatchPosts({ type: 'POSTS_CLEAR' })
    toast.success('You are logged out.')
    window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 0)
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-svh w-full max-w-[1220px] grid-cols-1 lg:grid-cols-[244px_minmax(0,1fr)] xl:grid-cols-[244px_minmax(0,640px)_312px]">
        <aside className="hidden border-r border-border/80 px-4 py-5 lg:block">
          <div className="sticky top-5 flex h-[calc(100svh-40px)] flex-col">
            <BrandMark />

            <nav className="mt-9 flex flex-col gap-2" aria-label="Primary navigation">
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${navLinkBase} bg-accent/10 text-foreground` : navLinkBase
                }
                to="/"
              >
                <Home aria-hidden="true" />
                Home
              </NavLink>

              {isAuthenticated ? (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${navLinkBase} bg-accent/10 text-foreground`
                      : navLinkBase
                  }
                  to="/profile"
                >
                  <User aria-hidden="true" />
                  Profile
                </NavLink>
              ) : (
                <>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkBase} bg-accent/10 text-foreground`
                        : navLinkBase
                    }
                    to="/login"
                  >
                    <LogIn aria-hidden="true" />
                    Login
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? `${navLinkBase} bg-accent/10 text-foreground`
                        : navLinkBase
                    }
                    to="/register"
                  >
                    <UserPlus aria-hidden="true" />
                    Register
                  </NavLink>
                </>
              )}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {user ? (
                <>
                  <Separator />
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-10 border border-border">
                      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.username}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.description || 'No description yet'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut data-icon="inline-start" aria-hidden="true" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <NavLink to="/register">Join Zgen</NavLink>
                </Button>
              )}
            </div>
          </div>
        </aside>

        <div className="min-w-0 border-r border-border/80 xl:border-r">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border/80 bg-background/88 px-4 backdrop-blur-md lg:hidden">
            <BrandMark />
            {user ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut aria-hidden="true" />
              </Button>
            ) : (
              <Button asChild size="sm">
                <NavLink to="/login">Login</NavLink>
              </Button>
            )}
          </header>

          <main id="main-content" className="min-h-svh min-w-0 pb-20 lg:pb-0">
            <Outlet />
          </main>
        </div>

        <RightRail />
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border/80 bg-background/95 px-[env(safe-area-inset-left)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Mobile navigation"
      >
        <NavLink className={navLinkBase} to="/">
          <Home aria-hidden="true" />
          <span className="sr-only">Home</span>
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink className={navLinkBase} to="/profile">
              <User aria-hidden="true" />
              <span className="sr-only">Profile</span>
            </NavLink>
            <button type="button" className={navLinkBase} onClick={handleLogout}>
              <LogOut aria-hidden="true" />
              <span className="sr-only">Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink className={navLinkBase} to="/login">
              <LogIn aria-hidden="true" />
              <span className="sr-only">Login</span>
            </NavLink>
            <NavLink className={navLinkBase} to="/register">
              <UserPlus aria-hidden="true" />
              <span className="sr-only">Register</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  )
}
