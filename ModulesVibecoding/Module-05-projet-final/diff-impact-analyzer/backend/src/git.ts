import { execFile } from 'node:child_process'
import { realpath, stat } from 'node:fs/promises'
import { promisify } from 'node:util'

import type { AnalysisMode, FileStatus, RepositoryInfo } from '../../shared/contracts.ts'

const execFileAsync = promisify(execFile)
const MAX_GIT_OUTPUT_BYTES = 10 * 1024 * 1024

export class GitCommandError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'GitCommandError'
  }
}

interface GitStatusEntry {
  status: FileStatus
  path: string
  previousPath: string | null
}

interface GitNumstatEntry {
  path: string
  previousPath: string | null
  additions: number | null
  deletions: number | null
  binary: boolean
}

export interface GitFileChange extends GitStatusEntry, GitNumstatEntry {}

async function runGit(repositoryPath: string, args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: repositoryPath,
      encoding: 'utf8',
      maxBuffer: MAX_GIT_OUTPUT_BYTES,
      windowsHide: true,
    })

    return stdout
  } catch (error) {
    throw new GitCommandError('Git could not inspect the selected repository.', {
      cause: error,
    })
  }
}

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/')
}

function mapStatus(status: string): FileStatus {
  switch (status[0]) {
    case 'A':
      return 'added'
    case 'C':
      return 'copied'
    case 'D':
      return 'deleted'
    case 'M':
      return 'modified'
    case 'R':
      return 'renamed'
    case 'T':
      return 'type-changed'
    default:
      return 'unknown'
  }
}

export function parseNameStatus(output: string): GitStatusEntry[] {
  const tokens = output.split('\0')
  const entries: GitStatusEntry[] = []
  let index = 0

  while (index < tokens.length && tokens[index] !== '') {
    const statusToken = tokens[index++]
    const status = mapStatus(statusToken)

    if (status === 'renamed' || status === 'copied') {
      const previousPath = tokens[index++]
      const path = tokens[index++]

      if (previousPath && path) {
        entries.push({
          status,
          path: normalizePath(path),
          previousPath: normalizePath(previousPath),
        })
      }
      continue
    }

    const path = tokens[index++]
    if (path) {
      entries.push({ status, path: normalizePath(path), previousPath: null })
    }
  }

  return entries
}

export function parseNumstat(output: string): GitNumstatEntry[] {
  const tokens = output.split('\0')
  const entries: GitNumstatEntry[] = []
  let index = 0

  while (index < tokens.length && tokens[index] !== '') {
    const record = tokens[index++]
    const firstTab = record.indexOf('\t')
    const secondTab = record.indexOf('\t', firstTab + 1)

    if (firstTab < 0 || secondTab < 0) {
      continue
    }

    const additionsText = record.slice(0, firstTab)
    const deletionsText = record.slice(firstTab + 1, secondTab)
    const inlinePath = record.slice(secondTab + 1)
    const binary = additionsText === '-' || deletionsText === '-'
    let previousPath: string | null = null
    let path = inlinePath

    if (inlinePath === '') {
      previousPath = tokens[index++] || null
      path = tokens[index++] || ''
    }

    if (path) {
      entries.push({
        path: normalizePath(path),
        previousPath: previousPath ? normalizePath(previousPath) : null,
        additions: binary ? null : Number.parseInt(additionsText, 10),
        deletions: binary ? null : Number.parseInt(deletionsText, 10),
        binary,
      })
    }
  }

  return entries
}

export async function getRepositoryInfo(repositoryPath: string): Promise<RepositoryInfo> {
  let resolvedPath: string

  try {
    resolvedPath = await realpath(repositoryPath)
    const repositoryStat = await stat(resolvedPath)
    if (!repositoryStat.isDirectory()) {
      throw new Error('Repository path is not a directory.')
    }
  } catch (error) {
    throw new GitCommandError('The repository path is not an accessible directory.', {
      cause: error,
    })
  }

  const root = (await runGit(resolvedPath, ['rev-parse', '--show-toplevel'])).trim()
  let branch: string | null = null

  try {
    branch = (await runGit(root, ['symbolic-ref', '--short', 'HEAD'])).trim() || null
  } catch {
    branch = null
  }

  return { root: normalizePath(root), branch }
}

export async function collectGitChanges(
  repositoryRoot: string,
  mode: AnalysisMode,
): Promise<GitFileChange[]> {
  const modeArguments = mode === 'staged' ? ['--cached'] : []
  const [numstatOutput, statusOutput] = await Promise.all([
    runGit(repositoryRoot, [
      'diff',
      ...modeArguments,
      '--numstat',
      '-z',
      '--find-renames',
    ]),
    runGit(repositoryRoot, [
      'diff',
      ...modeArguments,
      '--name-status',
      '-z',
      '--find-renames',
    ]),
  ])

  const statuses = parseNameStatus(statusOutput)
  const statsByPath = new Map(parseNumstat(numstatOutput).map((entry) => [entry.path, entry]))

  return statuses.map((status) => {
    const stats = statsByPath.get(status.path)

    return {
      ...status,
      previousPath: status.previousPath ?? stats?.previousPath ?? null,
      additions: stats ? stats.additions : 0,
      deletions: stats ? stats.deletions : 0,
      binary: stats?.binary ?? false,
    }
  })
}
