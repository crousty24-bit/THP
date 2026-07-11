import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import type { ChangedFile } from '../../../shared/contracts.ts'
import { FilesTable } from './FilesTable.tsx'

function file(index: number): ChangedFile {
  return {
    status: index === 12 ? 'renamed' : 'modified',
    path: `src/file-${index}.ts`,
    previousPath: index === 12 ? 'src/old-name.ts' : null,
    domain: 'src',
    fileType: '.ts',
    additions: index === 11 ? null : index,
    deletions: index === 11 ? null : 0,
    binary: index === 11,
    sensitiveCategories: [],
  }
}

afterEach(cleanup)

describe('FilesTable', () => {
  it('expands a long list and renders binary and renamed files', async () => {
    const files = Array.from({ length: 13 }, (_, index) => file(index))
    const user = userEvent.setup()

    render(<FilesTable files={files} />)

    expect(screen.queryByTitle('src/file-12.ts')).not.toBeInTheDocument()
    expect(screen.getByText('+bin.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Afficher tous les fichiers (13)' }))

    expect(screen.getByTitle('src/file-12.ts')).toBeInTheDocument()
    expect(screen.getByText('depuis src/old-name.ts')).toBeInTheDocument()
  })
})
