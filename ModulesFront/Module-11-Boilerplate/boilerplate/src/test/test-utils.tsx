import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { AppProviders } from '@/app/providers'
import { routes } from '@/app/router'

type RenderWithProvidersOptions = RenderOptions & {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...renderOptions }: RenderWithProvidersOptions = {},
) {
  window.history.pushState({}, 'Test page', route)

  return render(<AppProviders>{ui}</AppProviders>, renderOptions)
}

export function renderRoute(route = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [route],
  })

  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}
