import { AlertTriangle } from 'lucide-react'

import type { RiskSignal } from '../../../shared/contracts.ts'

interface SignalsPanelProps {
  signals: RiskSignal[]
}
export function SignalsPanel({ signals }: SignalsPanelProps) {
  return (
    <section className="signals-panel" aria-labelledby="signals-title">
      <div className="panel-heading">
        <h2 id="signals-title">Signaux de vigilance</h2>
        <span>{signals.length}</span>
      </div>
      {signals.length > 0 ? (
        <ul>
          {signals.map((signal) => (
            <li key={signal.id}>
              <AlertTriangle size={19} aria-hidden="true" />
              <div>
                <strong>{signal.label}</strong>
                <p>{signal.reason}</p>
                {signal.paths.length > 0 ? <code>{signal.paths.slice(0, 2).join(', ')}</code> : null}
              </div>
              <span>+{signal.points} pts</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-signals">Aucun seuil pondéré n’a été déclenché.</p>
      )}
    </section>
  )
}
