import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderRoute } from '@/test/test-utils'

describe('HomePage', () => {
  it('renders the starter introduction', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', {
        name: /build serious react apps without rebuilding the foundation/i,
      }),
    ).toBeInTheDocument()
  })
})
