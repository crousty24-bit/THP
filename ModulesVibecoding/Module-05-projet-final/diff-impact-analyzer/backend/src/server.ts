import { createApp } from './app.ts'
import { getRepositoryInfo } from './git.ts'

const PORT = 3000

function getRepositoryPath(args: string[]): string {
  if (args.length === 0) {
    return process.cwd()
  }

  if (args.length === 2 && args[0] === '--repo' && args[1]) {
    return args[1]
  }

  throw new Error('Usage: server [--repo <path>]')
}

async function startServer(): Promise<void> {
  try {
    const repository = await getRepositoryInfo(getRepositoryPath(process.argv.slice(2)))
    const app = createApp({ repository })

    app.listen(PORT, '127.0.0.1', () => {
      process.stdout.write(`Diff Impact Analyzer API: http://127.0.0.1:${PORT}\n`)
      process.stdout.write(`Repository: ${repository.root}\n`)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The server could not start.'
    process.stderr.write(`Error: ${message}\n`)
    process.exitCode = 1
  }
}

void startServer()

