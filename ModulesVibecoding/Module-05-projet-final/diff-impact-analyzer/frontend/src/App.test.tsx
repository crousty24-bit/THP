import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { AnalysisReport } from '../../shared/contracts.ts'
import App from './App.tsx'

const repositoryResponse = { root: '/projects/example', branch: 'main' }
const analysisResponse: AnalysisReport = {
  repository: repositoryResponse,
  mode: 'working',
  analyzedAt: '2026-07-10T10:00:00.000Z',
  metrics: {
    filesChanged: 1,
    additions: 120,
    deletions: 15,
    linesChanged: 135,
    domains: ['backend'],
    fileTypes: { '.ts': 1 },
  },
  files: [{
    status: 'modified',
    path: 'backend/src/auth.ts',
    previousPath: null,
    domain: 'backend',
    fileType: '.ts',
    additions: 120,
    deletions: 15,
    binary: false,
    sensitiveCategories: ['security'],
  }],
  signals: [{
    id: 'sensitive-security',
    label: 'Authentification ou sécurité modifiée',
    points: 30,
    reason: '1 fichier correspond à la règle security.',
    paths: ['backend/src/auth.ts'],
  }],
  risk: { score: 45, level: 'medium', label: 'Moyen' },
  summary: 'Risque moyen : un fichier sensible est concerné.',
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status,
  })
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Diff Impact Analyzer interface', () => {
  it('loads the repository and renders an analysis', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(repositoryResponse))
      .mockResolvedValueOnce(jsonResponse(analysisResponse))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()

    render(<App />)

    expect(await screen.findByText('/projects/example')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Indexé' }))
    await user.click(screen.getByRole('button', { name: 'Analyser' }))

    expect(await screen.findByLabelText('Risque Moyen')).toHaveTextContent('45/100')
    expect(screen.getByTitle('backend/src/auth.ts')).toBeInTheDocument()
    expect(screen.getByText('Authentification ou sécurité modifiée')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3000/api/analyze',
      expect.objectContaining({ body: JSON.stringify({ mode: 'staged' }), method: 'POST' }),
    )
  })

  it('shows a useful message when the local API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connection refused')))

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de joindre l’API locale')
    expect(screen.getByRole('button', { name: 'Analyser' })).toBeDisabled()
  })

  it('shows a structured analysis error and keeps retry available', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(repositoryResponse))
      .mockResolvedValueOnce(jsonResponse({
        error: { code: 'GIT_COMMAND_FAILED', message: 'Git inspection failed.' },
      }, 500))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()

    render(<App />)

    expect(await screen.findByText('/projects/example')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Analyser' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Git inspection failed.')
    expect(screen.getByRole('button', { name: 'Analyser' })).toBeEnabled()
  })

  it('renders the empty-report state', async () => {
    const emptyReport: AnalysisReport = {
      ...analysisResponse,
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
      summary: 'Aucun changement suivi détecté pour ce mode.',
    }
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse(repositoryResponse))
      .mockResolvedValueOnce(jsonResponse(emptyReport)))
    const user = userEvent.setup()

    render(<App />)

    expect(await screen.findByText('/projects/example')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Analyser' }))

    expect(await screen.findByRole('heading', { name: 'Aucun changement suivi' }))
      .toBeInTheDocument()
    expect(screen.getByLabelText('Risque Faible')).toHaveTextContent('0/100')
  })
})
