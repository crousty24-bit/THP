import { GitBranch, Radio, TerminalSquare } from 'lucide-react'

import type { RepositoryInfo } from '../../../shared/contracts.ts'

interface AppHeaderProps {
  isConnected: boolean
  repository: RepositoryInfo | null
}

export function AppHeader({ isConnected, repository }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          <TerminalSquare size={19} strokeWidth={1.8} />
        </span>
        <div>
          <h1>Diff Impact Analyzer</h1>
        </div>
      </div>

      <div className="repository-context" aria-label="Dépôt analysé">
        <div className="repository-item">
          <span className="repository-label">Dépôt</span>
          <code title={repository?.root}>{repository?.root ?? 'Chargement…'}</code>
        </div>
        <div className="repository-item branch-item">
          <GitBranch size={15} aria-hidden="true" />
          <code>{repository?.branch ?? 'detached HEAD'}</code>
        </div>
        <div className={`connection-state ${isConnected ? 'is-connected' : ''}`}>
          <Radio size={14} aria-hidden="true" />
          {isConnected ? 'API connectée' : 'API indisponible'}
        </div>
      </div>
    </header>
  )
}
