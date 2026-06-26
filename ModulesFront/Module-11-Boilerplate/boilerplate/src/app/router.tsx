import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/features/home/pages/HomePage'
import { NotFoundPage } from '@/features/home/pages/NotFoundPage'

const routerBasename =
  new URL(import.meta.env.BASE_URL, window.location.href).pathname.replace(/\/$/, '') ||
  '/'

export const routes = [
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes, {
  basename: routerBasename,
})
