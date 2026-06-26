import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { toast } from 'sonner'

import { fetchMe, isApiEnabled, refreshSession } from '@/api/client'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PwaInstallNotifier } from '@/components/PwaInstallNotifier'
import { Toaster } from '@/components/ui/sonner'
import { useAuthDispatch, useAuthState } from '@/store/hooks'

import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PostPage } from '@/pages/PostPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { UserPage } from '@/pages/UserPage'

const routerBasename =
  new URL(import.meta.env.BASE_URL, window.location.href).pathname.replace(/\/$/, '') ||
  '/'

function AuthSessionBootstrap() {
  const dispatchAuth = useAuthDispatch()
  const { accessToken, user } = useAuthState()
  const userId = user?.id

  useEffect(() => {
    let isCurrent = true

    if (!isApiEnabled) {
      dispatchAuth({ type: 'AUTH_SESSION_RESOLVED' })
      return
    }

    refreshSession()
      .then((payload) => {
        if (isCurrent) {
          dispatchAuth({ type: 'AUTH_SUCCESS', payload })
        }
      })
      .catch(() => {
        if (isCurrent) {
          dispatchAuth({ type: 'AUTH_SESSION_RESOLVED' })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [dispatchAuth])

  useEffect(() => {
    if (!accessToken || !userId) {
      return
    }

    let isCurrent = true

    fetchMe(accessToken)
      .then((freshUser) => {
        if (isCurrent) {
          dispatchAuth({ type: 'AUTH_USER_UPDATED', payload: freshUser })
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return
        }

        if (error instanceof Error && 'status' in error) {
          const status = Number(error.status)

          if (status === 401 || status === 403) {
            dispatchAuth({ type: 'AUTH_LOGOUT' })
            toast.error('Session expired. Please log in again.')
          }
        }
      })

    return () => {
      isCurrent = false
    }
  }, [accessToken, dispatchAuth, userId])

  return null
}

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthSessionBootstrap />
      <PwaInstallNotifier />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:username"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}

export default App
