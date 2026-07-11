#!/usr/bin/env node
import { analyzeRepository } from './analyzer.ts'
import { GitCommandError } from './git.ts'
import { renderMarkdownReport, renderTextReport } from './reports.ts'

interface CliOptions {
  format: 'markdown' | 'text'
  help: boolean
  repositoryPath: string
  staged: boolean
}

class CliUsageError extends Error {}

function usage(): string {
  return [
    'Usage: diff-impact-analyzer [--repo <path>] [--staged] [--format text|markdown]',
    '',
    'Options:',
    '  --repo <path>          Repository to inspect (defaults to current directory)',
    '  --staged               Analyze staged changes instead of the working tree',
    '  --format <format>      text (default) or markdown',
    '  --help                 Show this help',
  ].join('\n')
}

export function parseCliArguments(args: string[]): CliOptions {
  const options: CliOptions = {
    format: 'text',
    help: false,
    repositoryPath: process.cwd(),
    staged: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === '--staged') {
      options.staged = true
      continue
    }

    if (argument === '--help') {
      options.help = true
      continue
    }

    if (argument === '--repo') {
      const repositoryPath = args[index + 1]
      if (!repositoryPath) {
        throw new CliUsageError('--repo requires a path.')
      }
      options.repositoryPath = repositoryPath
      index += 1
      continue
    }

    if (argument === '--format') {
      const format = args[index + 1]
      if (format !== 'text' && format !== 'markdown') {
        throw new CliUsageError('--format must be text or markdown.')
      }
      options.format = format
      index += 1
      continue
    }

    throw new CliUsageError(`Unknown argument: ${argument}`)
  }

  return options
}

async function main(): Promise<void> {
  try {
    const options = parseCliArguments(process.argv.slice(2))
    if (options.help) {
      process.stdout.write(`${usage()}\n`)
      return
    }

    const report = await analyzeRepository(
      options.repositoryPath,
      options.staged ? 'staged' : 'working',
    )
    process.stdout.write(
      options.format === 'markdown'
        ? renderMarkdownReport(report)
        : renderTextReport(report),
    )
  } catch (error) {
    if (error instanceof CliUsageError) {
      process.stderr.write(`${error.message}\n\n${usage()}\n`)
      process.exitCode = 2
      return
    }

    const message = error instanceof GitCommandError
      ? error.message
      : 'The analysis could not be completed.'
    process.stderr.write(`Error: ${message}\n`)
    process.exitCode = 1
  }
}

void main()

