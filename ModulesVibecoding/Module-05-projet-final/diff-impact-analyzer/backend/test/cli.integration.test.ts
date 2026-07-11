import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cliPath = join(backendRoot, 'dist', 'cli.js')
let repositoryPath: string

async function git(...args: string[]): Promise<void> {
  await execFileAsync('git', args, { cwd: repositoryPath })
}

async function runCli(args: string[]) {
  try {
    const result = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: backendRoot,
      encoding: 'utf8',
    })
    return { status: 0, stdout: result.stdout, stderr: result.stderr }
  } catch (error) {
    const failure = error as NodeJS.ErrnoException & { code?: number; stdout?: string; stderr?: string }
    return {
      status: typeof failure.code === 'number' ? failure.code : 1,
      stdout: failure.stdout ?? '',
      stderr: failure.stderr ?? '',
    }
  }
}

describe('CLI', () => {
  beforeAll(async () => {
    await execFileAsync('npm', ['run', 'build', '--silent'], { cwd: backendRoot })
    repositoryPath = await mkdtemp(join(tmpdir(), 'diff-impact-cli-'))
    await git('init', '--quiet')
    await git('config', 'user.email', 'tests@example.com')
    await git('config', 'user.name', 'Diff Impact Analyzer Tests')
    await mkdir(join(repositoryPath, 'src'))
    await writeFile(join(repositoryPath, 'src', 'index.ts'), 'export const answer = 42\n')
    await git('add', '.')
    await git('commit', '--quiet', '-m', 'Initial fixture')
    await writeFile(join(repositoryPath, 'src', 'index.ts'), 'export const answer = 43\n')
    await git('add', 'src/index.ts')
  })

  afterAll(async () => {
    await rm(repositoryPath, { force: true, recursive: true })
  })

  it('prints help and rejects invalid usage with documented exit codes', async () => {
    const help = await runCli(['--help'])
    const invalid = await runCli(['--format', 'json'])

    expect(help).toMatchObject({ status: 0, stderr: '' })
    expect(help.stdout).toContain('Usage: diff-impact-analyzer')
    expect(invalid.status).toBe(2)
    expect(invalid.stdout).toBe('')
    expect(invalid.stderr).toContain('--format must be text or markdown')
  })

  it('renders staged changes as text and Markdown', async () => {
    const text = await runCli(['--repo', repositoryPath, '--staged'])
    const markdown = await runCli([
      '--repo', repositoryPath, '--staged', '--format', 'markdown',
    ])

    expect(text.status).toBe(0)
    expect(text.stdout).toContain('Mode       : staged')
    expect(text.stdout).toContain('M src/index.ts')
    expect(markdown.status).toBe(0)
    expect(markdown.stdout).toContain('# Diff Impact Analyzer')
    expect(markdown.stdout).toContain('| M | `src/index.ts` | src |')
  })

  it('returns a runtime error outside a Git repository', async () => {
    const nonRepository = await mkdtemp(join(tmpdir(), 'diff-impact-not-git-'))

    try {
      const result = await runCli(['--repo', nonRepository])
      expect(result.status).toBe(1)
      expect(result.stdout).toBe('')
      expect(result.stderr).toContain('Error:')
    } finally {
      await rm(nonRepository, { force: true, recursive: true })
    }
  })
})
