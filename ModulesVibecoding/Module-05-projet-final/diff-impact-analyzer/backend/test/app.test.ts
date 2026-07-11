import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'

import type { AnalysisReport, RepositoryInfo } from '../../shared/contracts.ts'
import { createApp } from '../src/app.ts'
import { GitCommandError } from '../src/git.ts'

const repository: RepositoryInfo = { root: '/tmp/example', branch: 'main' }
const report: AnalysisReport = {
  repository,
  mode: 'working',
  analyzedAt: '2026-07-10T10:00:00.000Z',
  metrics: {
    filesChanged: 0,
    additions: 0,
    deletions: 0,
    linesChanged: 0,
    domains: [],
    fileTypes: {},
  },
  files: [],
  signals: [],
  risk: { score: 0, level: 'low', label: 'Faible' },
  summary: 'No change.',
}

describe('analysis API', () => {
  it('returns the configured repository', async () => {
    const response = await request(createApp({ repository })).get('/api/repository')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(repository)
  })

  it('validates the analysis mode', async () => {
    const response = await request(createApp({ repository }))
      .post('/api/analyze')
      .send({ mode: 'branch' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: { code: 'INVALID_MODE', message: 'mode must be working or staged' },
    })
  })

  it('returns an analysis report', async () => {
    const analyze = vi.fn().mockResolvedValue(report)
    const response = await request(createApp({ repository, analyze }))
      .post('/api/analyze')
      .send({ mode: 'working' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(report)
    expect(analyze).toHaveBeenCalledWith(repository, 'working')
  })

  it('returns a structured Git error', async () => {
    const analyze = vi.fn().mockRejectedValue(new GitCommandError('Git inspection failed.'))
    const response = await request(createApp({ repository, analyze }))
      .post('/api/analyze')
      .send({ mode: 'working' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: { code: 'GIT_COMMAND_FAILED', message: 'Git inspection failed.' },
    })
  })

  it('does not expose unexpected internal errors', async () => {
    const analyze = vi.fn().mockRejectedValue(new Error('sensitive implementation detail'))
    const response = await request(createApp({ repository, analyze }))
      .post('/api/analyze')
      .send({ mode: 'staged' })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'The analysis could not be completed.' },
    })
    expect(response.text).not.toContain('sensitive implementation detail')
  })

  it('allows only the documented Vite origins', async () => {
    const allowed = await request(createApp({ repository }))
      .get('/api/repository')
      .set('Origin', 'http://localhost:5173')
    const denied = await request(createApp({ repository }))
      .get('/api/repository')
      .set('Origin', 'https://example.com')

    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173')
    expect(denied.status).toBe(500)
    expect(denied.headers['access-control-allow-origin']).toBeUndefined()
  })
})
