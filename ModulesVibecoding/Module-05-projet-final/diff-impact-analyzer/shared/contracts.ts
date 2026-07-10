export type AnalysisMode = 'working' | 'staged'

export type FileStatus =
  | 'added'
  | 'copied'
  | 'deleted'
  | 'modified'
  | 'renamed'
  | 'type-changed'
  | 'unknown'

export type SensitiveCategory =
  | 'database'
  | 'dependencies'
  | 'infrastructure'
  | 'security'

export type RiskLevel = 'high' | 'low' | 'medium'

export interface RepositoryInfo {
  root: string
  branch: string | null
}

export interface ChangedFile {
  status: FileStatus
  path: string
  previousPath: string | null
  domain: string
  fileType: string
  additions: number | null
  deletions: number | null
  binary: boolean
  sensitiveCategories: SensitiveCategory[]
}

export interface AnalysisMetrics {
  filesChanged: number
  additions: number
  deletions: number
  linesChanged: number
  domains: string[]
  fileTypes: Record<string, number>
}

export interface RiskSignal {
  id: string
  label: string
  points: number
  reason: string
  paths: string[]
}

export interface RiskAssessment {
  score: number
  level: RiskLevel
  label: 'Élevé' | 'Faible' | 'Moyen'
}

export interface AnalysisReport {
  repository: RepositoryInfo
  mode: AnalysisMode
  analyzedAt: string
  metrics: AnalysisMetrics
  files: ChangedFile[]
  signals: RiskSignal[]
  risk: RiskAssessment
  summary: string
}

export interface ApiErrorResponse {
  error: {
    code: 'GIT_COMMAND_FAILED' | 'INTERNAL_ERROR' | 'INVALID_MODE'
    message: string
  }
}

