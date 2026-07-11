import type {
  AnalysisMode,
  AnalysisReport,
  RepositoryInfo,
} from '../../shared/contracts.ts'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000/api'
const FILE_STATUSES = new Set([
  'added', 'copied', 'deleted', 'modified', 'renamed', 'type-changed', 'unknown',
])
const SENSITIVE_CATEGORIES = new Set([
  'database', 'dependencies', 'infrastructure', 'security',
])
const RISK_LEVELS = new Set(['high', 'low', 'medium'])
const RISK_LABELS = new Set(['Élevé', 'Faible', 'Moyen'])

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

function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value)
    && Object.values(value).every((item) => typeof item === 'number')
}

function isMetrics(value: unknown): value is AnalysisReport['metrics'] {
  return isRecord(value)
    && typeof value.filesChanged === 'number'
    && typeof value.additions === 'number'
    && typeof value.deletions === 'number'
    && typeof value.linesChanged === 'number'
    && Array.isArray(value.domains)
    && value.domains.every((domain) => typeof domain === 'string')
    && isNumberRecord(value.fileTypes)
}

function isChangedFile(value: unknown): value is AnalysisReport['files'][number] {
  return isRecord(value)
    && typeof value.status === 'string'
    && FILE_STATUSES.has(value.status)
    && typeof value.path === 'string'
    && (typeof value.previousPath === 'string' || value.previousPath === null)
    && typeof value.domain === 'string'
    && typeof value.fileType === 'string'
    && (typeof value.additions === 'number' || value.additions === null)
    && (typeof value.deletions === 'number' || value.deletions === null)
    && typeof value.binary === 'boolean'
    && Array.isArray(value.sensitiveCategories)
    && value.sensitiveCategories.every((category) => (
      typeof category === 'string' && SENSITIVE_CATEGORIES.has(category)
    ))
}

function isRiskSignal(value: unknown): value is AnalysisReport['signals'][number] {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.label === 'string'
    && typeof value.points === 'number'
    && typeof value.reason === 'string'
    && Array.isArray(value.paths)
    && value.paths.every((path) => typeof path === 'string')
}

function isRisk(value: unknown): value is AnalysisReport['risk'] {
  return isRecord(value)
    && typeof value.score === 'number'
    && typeof value.level === 'string'
    && RISK_LEVELS.has(value.level)
    && typeof value.label === 'string'
    && RISK_LABELS.has(value.label)
}

function isAnalysisReport(value: unknown): value is AnalysisReport {
  return isRecord(value)
    && isRepositoryInfo(value.repository)
    && (value.mode === 'working' || value.mode === 'staged')
    && typeof value.analyzedAt === 'string'
    && isMetrics(value.metrics)
    && Array.isArray(value.files)
    && value.files.every(isChangedFile)
    && Array.isArray(value.signals)
    && value.signals.every(isRiskSignal)
    && isRisk(value.risk)
    && typeof value.summary === 'string'
}

function getErrorMessage(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.error)) {
    return null
  }

  return typeof value.error.message === 'string' ? value.error.message : null
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
