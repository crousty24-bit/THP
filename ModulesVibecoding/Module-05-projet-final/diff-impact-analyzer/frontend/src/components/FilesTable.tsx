import { useState } from 'react'

import type { ChangedFile } from '../../../shared/contracts.ts'

interface FilesTableProps {
  files: ChangedFile[]
}

const STATUS_LABEL: Record<ChangedFile['status'], string> = {
  added: 'A',
  copied: 'C',
  deleted: 'D',
  modified: 'M',
  renamed: 'R',
  'type-changed': 'T',
  unknown: '?',
}

function lineValue(value: number | null): string {
  return value === null ? 'bin.' : String(value)
}

export function FilesTable({ files }: FilesTableProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleFiles = showAll ? files : files.slice(0, 12)

  return (
    <section className={`files-panel ${showAll ? 'show-all' : ''}`} aria-labelledby="files-title">
      <div className="panel-heading">
        <h2 id="files-title">Fichiers modifiés</h2>
        <span>{files.length}</span>
      </div>
      <div className="table-frame">
        <table>
          <thead>
            <tr>
              <th scope="col">Chemin du fichier</th>
              <th scope="col">Statut</th>
              <th scope="col">Domaine</th>
              <th scope="col">Ajouts</th>
              <th scope="col">Suppressions</th>
            </tr>
          </thead>
          <tbody>
            {visibleFiles.map((file) => (
              <tr key={`${file.previousPath ?? ''}:${file.path}`}>
                <td data-label="Fichier">
                  <code title={file.path}>{file.path}</code>
                  {file.previousPath ? <small>depuis {file.previousPath}</small> : null}
                </td>
                <td data-label="Statut"><span className="status-code">{STATUS_LABEL[file.status]}</span></td>
                <td data-label="Domaine"><code>{file.domain}</code></td>
                <td data-label="Ajouts" className="value-addition">+{lineValue(file.additions)}</td>
                <td data-label="Suppressions" className="value-deletion">−{lineValue(file.deletions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {files.length > 6 && !showAll ? (
        <button className="show-files-button" type="button" onClick={() => setShowAll(true)}>
          Afficher tous les fichiers ({files.length})
        </button>
      ) : null}
    </section>
  )
}
