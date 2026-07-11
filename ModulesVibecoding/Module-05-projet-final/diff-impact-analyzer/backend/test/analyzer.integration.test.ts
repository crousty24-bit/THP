import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { analyzeRepository } from '../src/analyzer.ts'

const execFileAsync = promisify(execFile)
let repositoryPath: string

async function git(...args: string[]): Promise<void> {
  await execFileAsync('git', args, { cwd: repositoryPath })
}

describe('repository analysis', () => {
  beforeEach(async () => {
    repositoryPath = await mkdtemp(join(tmpdir(), 'diff-impact-analyzer-'))
    await git('init', '--quiet')
    await git('config', 'user.email', 'tests@example.com')
    await git('config', 'user.name', 'Diff Impact Analyzer Tests')
    await mkdir(join(repositoryPath, 'src'))
    await writeFile(join(repositoryPath, 'src', 'index.ts'), 'export const answer = 42\n')
    await writeFile(join(repositoryPath, 'README.md'), '# Fixture\n')
    await git('add', '.')
    await git('commit', '--quiet', '-m', 'Initial fixture')
  })

  afterEach(async () => {
    await rm(repositoryPath, { force: true, recursive: true })
  })

  it('keeps staged and working changes separate and ignores untracked files', async () => {
    await writeFile(join(repositoryPath, 'src', 'index.ts'), 'export const answer = 42\nexport const ready = true\n')
    await git('add', 'src/index.ts')
    await writeFile(join(repositoryPath, 'README.md'), '# Fixture\n\nWorking tree note.\n')
    await writeFile(join(repositoryPath, 'untracked.ts'), 'export const ignored = true\n')

    const staged = await analyzeRepository(repositoryPath, 'staged')
    const working = await analyzeRepository(repositoryPath, 'working')

    expect(staged.files.map((file) => file.path)).toEqual(['src/index.ts'])
    expect(staged.metrics.additions).toBe(1)
    expect(working.files.map((file) => file.path)).toEqual(['README.md'])
    expect(working.metrics.additions).toBe(2)
    expect(working.files.some((file) => file.path === 'untracked.ts')).toBe(false)
  })

  it('records renamed and binary files', async () => {
    await git('mv', 'src/index.ts', 'src/main.ts')
    await writeFile(join(repositoryPath, 'asset.bin'), Buffer.from([0, 1, 2, 3]))
    await git('add', 'asset.bin')

    const staged = await analyzeRepository(repositoryPath, 'staged')
    const renamedFile = staged.files.find((file) => file.path === 'src/main.ts')
    const binaryFile = staged.files.find((file) => file.path === 'asset.bin')

    expect(renamedFile).toMatchObject({
      status: 'renamed',
      previousPath: 'src/index.ts',
    })
    expect(binaryFile).toMatchObject({
      binary: true,
      additions: null,
      deletions: null,
    })
  })
})

