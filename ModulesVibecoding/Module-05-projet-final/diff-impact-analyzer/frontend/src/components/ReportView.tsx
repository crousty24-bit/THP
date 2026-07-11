import { Info } from 'lucide-react'

import type { AnalysisReport } from '../../../shared/contracts.ts'
import { FilesTable } from './FilesTable.tsx'
import { MetricsStrip } from './MetricsStrip.tsx'
import { RiskPanel } from './RiskPanel.tsx'
import { SignalsPanel } from './SignalsPanel.tsx'

interface ReportViewProps {
  report: AnalysisReport
}
export function ReportView({ report }: ReportViewProps) {
  return (
    <div className="report-view">
      <div className="overview-grid">
        <MetricsStrip metrics={report.metrics} />
        <RiskPanel risk={report.risk} />
      </div>

      {report.files.length > 0 ? (
        <div className="report-grid">
          <FilesTable files={report.files} />
          <aside className="report-aside">
            <SignalsPanel signals={report.signals} />
            <section className="summary-panel" aria-labelledby="summary-title">
              <div className="panel-heading">
                <h2 id="summary-title">Résumé</h2>
              </div>
              <p>{report.summary}</p>
            </section>
          </aside>
        </div>
      ) : (
        <section className="empty-report">
          <h2>Aucun changement suivi</h2>
          <p>{report.summary}</p>
        </section>
      )}

      <p className="scope-disclaimer">
        <Info size={18} aria-hidden="true" />
        <span>
          Le score d’impact mesure l’étendue des changements et les signaux de vigilance,
          pas la qualité du code. Il ne remplace ni la revue ni les tests.
        </span>
      </p>
    </div>
  )
}
