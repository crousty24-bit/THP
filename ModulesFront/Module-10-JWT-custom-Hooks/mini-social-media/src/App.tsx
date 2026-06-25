import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { toast } from 'sonner'

import { fetchMe } from '@/api/client'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { UserPage } from '@/pages/UserPage'

const routerBasename =
  new URL(import.meta.env.BASE_URL, window.location.href).pathname.replace(/\/$/, '') ||
  '/'

function AuthSessionValidator() {
  const dispatch = useAppDispatch()
  const { jwt, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!jwt || !user) {
      return
    }

    let isCurrent = true

    fetchMe(jwt)
      .then((freshUser) => {
        if (isCurrent) {
          dispatch({ type: 'AUTH_USER_UPDATED', payload: freshUser })
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return
        }

        if (error instanceof Error && 'status' in error) {
          const status = Number(error.status)

          if (status === 401 || status === 403) {
            dispatch({ type: 'AUTH_LOGOUT' })
            toast.error('Session expired. Please log in again.')
          }
        }
      })

    return () => {
      isCurrent = false
    }
  }, [dispatch, jwt, user])

  return null
}

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AuthSessionValidator />
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
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}

export default App
