import { Play } from 'lucide-react'

import type { AnalysisMode } from '../../../shared/contracts.ts'

interface AnalysisControlsProps {
  isDisabled: boolean
  isLoading: boolean
  mode: AnalysisMode
  onAnalyze: () => void
  onModeChange: (mode: AnalysisMode) => void
}
export function AnalysisControls({
  isDisabled,
  isLoading,
  mode,
  onAnalyze,
  onModeChange,
}: AnalysisControlsProps) {
  return (
    <section className="analysis-toolbar" aria-label="Paramètres d’analyse">
      <fieldset className="mode-selector">
        <legend className="visually-hidden">Périmètre Git</legend>
        <label className={mode === 'working' ? 'is-selected' : ''}>
          <input
            type="radio"
            name="analysis-mode"
            value="working"
            checked={mode === 'working'}
            onChange={() => onModeChange('working')}
          />
          Non indexé
        </label>
        <label className={mode === 'staged' ? 'is-selected' : ''}>
          <input
            type="radio"
            name="analysis-mode"
            value="staged"
            checked={mode === 'staged'}
            onChange={() => onModeChange('staged')}
          />
          Indexé
        </label>
      </fieldset>

      <p className="mode-explanation">
        {mode === 'working'
          ? 'Compare le working tree avec l’index.'
          : 'Compare l’index avec le dernier commit.'}
      </p>

      <button
        className="analyze-button"
        type="button"
        onClick={onAnalyze}
        disabled={isDisabled || isLoading}
      >
        <Play size={17} fill="currentColor" aria-hidden="true" />
        {isLoading ? 'Analyse…' : 'Analyser'}
      </button>
    </section>
  )
}
