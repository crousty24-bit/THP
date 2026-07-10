import type {
  AnalysisMode,
  AnalysisReport,
  ApiErrorResponse,
  RepositoryInfo,
} from '../../shared/contracts.ts'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000/api'

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRepositoryInfo(value: unknown): value is RepositoryInfo {
  return isRecord(value)
    && typeof value.root === 'string'
    && (typeof value.branch === 'string' || value.branch === null)
}

function isAnalysisReport(value: unknown): value is AnalysisReport {
  return isRecord(value)
    && isRepositoryInfo(value.repository)
    && (value.mode === 'working' || value.mode === 'staged')
    && isRecord(value.metrics)
    && Array.isArray(value.files)
    && Array.isArray(value.signals)
    && isRecord(value.risk)
    && typeof value.summary === 'string'
}

function getErrorMessage(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null
  }

  const error = value as unknown as ApiErrorResponse
  return typeof error.error.message === 'string' ? error.error.message : null
}

async function requestJson(url: string, init?: RequestInit): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(url, init)
  } catch {
    throw new ApiError('Impossible de joindre l’API locale. Vérifiez que le serveur Node est lancé.')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ApiError('L’API locale a renvoyé une réponse illisible.')
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data) ?? 'L’analyse a échoué.')
  }

  return data
}

export async function fetchRepository(signal?: AbortSignal): Promise<RepositoryInfo> {
  const data = await requestJson(`${API_BASE_URL}/repository`, { signal })
  if (!isRepositoryInfo(data)) {
    throw new ApiError('Le contrat du dépôt renvoyé par l’API est invalide.')
  }

  return data
}

export async function fetchAnalysis(mode: AnalysisMode): Promise<AnalysisReport> {
  const data = await requestJson(`${API_BASE_URL}/analyze`, {
    body: JSON.stringify({ mode }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!isAnalysisReport(data)) {
    throw new ApiError('Le contrat du rapport renvoyé par l’API est invalide.')
  }

  return data
}
