import { AlertTriangle } from 'lucide-react'

import type { RiskAssessment } from '../../../shared/contracts.ts'

interface RiskPanelProps {
  risk: RiskAssessment
}
export function RiskPanel({ risk }: RiskPanelProps) {
  return (
    <section className={`risk-panel risk-${risk.level}`} aria-label={`Risque ${risk.label}`}>
      <div>
        <span className="panel-label">Score d’impact</span>
        <div className="risk-value">
          <strong>{risk.score}<small>/100</small></strong>
          <span>{risk.label.toUpperCase()}</span>
        </div>
      </div>
      <p>
        <AlertTriangle size={17} aria-hidden="true" />
        Revue manuelle recommandée avant commit.
      </p>
    </section>
  )
}
