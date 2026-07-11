import cors from 'cors'
import express, { type Express } from 'express'

import type {
  AnalysisMode,
  AnalysisReport,
  ApiErrorResponse,
  RepositoryInfo,
} from '../../shared/contracts.ts'
import { analyzeRepositoryWithInfo } from './analyzer.ts'
import { GitCommandError } from './git.ts'

const ALLOWED_ORIGINS = new Set([
  'http://127.0.0.1:5173',
  'http://localhost:5173',
])

type AnalyzeFunction = (
  repository: RepositoryInfo,
  mode: AnalysisMode,
) => Promise<AnalysisReport>

interface AppOptions {
  repository: RepositoryInfo
  analyze?: AnalyzeFunction
}

function sendError(
  response: express.Response<ApiErrorResponse>,
  status: number,
  code: ApiErrorResponse['error']['code'],
  message: string,
): void {
  response.status(status).json({ error: { code, message } })
}

export function createApp({
  repository,
  analyze = analyzeRepositoryWithInfo,
}: AppOptions): Express {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.has(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin is not allowed by CORS.'))
    },
  }))
  app.use(express.json({ limit: '16kb' }))

  app.get('/api/repository', (_request, response) => {
    response.json(repository)
  })

  app.post('/api/analyze', async (request, response) => {
    const mode = request.body?.mode
    if (mode !== 'working' && mode !== 'staged') {
      sendError(response, 400, 'INVALID_MODE', 'mode must be working or staged')
      return
    }

    try {
      response.json(await analyze(repository, mode))
    } catch (error) {
      if (error instanceof GitCommandError) {
        sendError(response, 500, 'GIT_COMMAND_FAILED', error.message)
        return
      }

      sendError(response, 500, 'INTERNAL_ERROR', 'The analysis could not be completed.')
    }
  })

  return app
}

