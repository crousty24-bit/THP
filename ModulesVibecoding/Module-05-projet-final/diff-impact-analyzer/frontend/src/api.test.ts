import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, fetchAnalysis, fetchRepository } from './api.ts'

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('API boundary validation', () => {
  it('rejects an invalid repository contract', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ root: 42, branch: 'main' })))

    await expect(fetchRepository()).rejects.toThrow(
      'Le contrat du dépôt renvoyé par l’API est invalide.',
    )
  })

  it('rejects a report with invalid nested metrics', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      repository: { root: '/tmp/example', branch: 'main' },
      mode: 'working',
      analyzedAt: '2026-07-11T08:00:00.000Z',
      metrics: {},
      files: [],
      signals: [],
      risk: { score: 0, level: 'low', label: 'Faible' },
      summary: 'Invalid report.',
    })))

    await expect(fetchAnalysis('working')).rejects.toThrow(
      'Le contrat du rapport renvoyé par l’API est invalide.',
    )
  })

  it('surfaces structured API errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      error: { code: 'GIT_COMMAND_FAILED', message: 'Git inspection failed.' },
    }, 500)))

    await expect(fetchAnalysis('staged')).rejects.toThrow('Git inspection failed.')
  })

  it('rejects a non-JSON response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json')))

    await expect(fetchRepository()).rejects.toEqual(
      new ApiError('L’API locale a renvoyé une réponse illisible.'),
    )
  })
})

