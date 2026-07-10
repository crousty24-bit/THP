import { FileCode2, FolderTree, Minus, Plus } from 'lucide-react'

import type { AnalysisMetrics } from '../../../shared/contracts.ts'

interface MetricsStripProps {
  metrics: AnalysisMetrics
}
const metricsDefinition = [
  { key: 'filesChanged', label: 'Fichiers', className: 'files', Icon: FileCode2 },
  { key: 'additions', label: 'Ajouts', className: 'additions', Icon: Plus },
  { key: 'deletions', label: 'Suppressions', className: 'deletions', Icon: Minus },
] as const

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <section className="metrics-strip" aria-label="Métriques du diff">
      {metricsDefinition.map(({ key, label, className, Icon }) => (
        <div className={`metric ${className}`} key={key}>
          <div>
            <span>{label}</span>
            <strong>{metrics[key]}</strong>
          </div>
          <Icon size={27} strokeWidth={1.7} aria-hidden="true" />
        </div>
      ))}
      <div className="metric domains">
        <div>
          <span>Domaines</span>
          <strong>{metrics.domains.length}</strong>
        </div>
        <FolderTree size={27} strokeWidth={1.7} aria-hidden="true" />
      </div>
    </section>
  )
}
