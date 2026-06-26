import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '@/lib/api/client'

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds requests with query parameters and bearer token', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const response = await apiClient.get<{ ok: boolean }>('/projects', {
      query: { page: 2 },
      token: 'token-123',
    })

    expect(response).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/projects?page=2'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      }),
    )

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers

    expect(headers.get('Authorization')).toBe('Bearer token-123')
  })

  it('throws typed API errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(apiClient.get('/private')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Forbidden',
      status: 403,
    })
  })
})
