import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'

import type { AnalysisMode, AnalysisReport, RepositoryInfo } from '../../shared/contracts.ts'
import { ApiError, fetchAnalysis, fetchRepository } from './api.ts'
import { AnalysisControls } from './components/AnalysisControls.tsx'
import { AppHeader } from './components/AppHeader.tsx'
import { ReportView } from './components/ReportView.tsx'

export default function App() {
  const [repository, setRepository] = useState<RepositoryInfo | null>(null)
  const [mode, setMode] = useState<AnalysisMode>('working')
  const [report, setReport] = useState<AnalysisReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetchRepository(controller.signal)
      .then(setRepository)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof ApiError ? reason.message : 'Impossible de charger le dépôt.')
        }
      })

    return () => controller.abort()
  }, [])

  async function handleAnalyze() {
    setIsLoading(true)
    setError(null)

    try {
      setReport(await fetchAnalysis(mode))
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'L’analyse a échoué.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader isConnected={repository !== null} repository={repository} />
      <main>
        <AnalysisControls
          isDisabled={repository === null}
          isLoading={isLoading}
          mode={mode}
          onAnalyze={handleAnalyze}
          onModeChange={setMode}
        />

        <div className="status-region" aria-live="polite">
          {error ? <p className="error-message" role="alert">{error}</p> : null}
          {isLoading ? <p className="loading-message">Analyse Git en cours…</p> : null}
        </div>

        {report ? (
          <ReportView report={report} />
        ) : (
          <section className="initial-state">
            <Info size={23} aria-hidden="true" />
            <div>
              <h2>Prêt pour une première analyse</h2>
              <p>
                Choisissez le périmètre Git puis lancez l’analyse. Aucun contenu du diff
                n’est envoyé à un service distant.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
