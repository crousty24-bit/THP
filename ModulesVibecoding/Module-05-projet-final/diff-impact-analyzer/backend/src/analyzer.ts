import type {
  AnalysisMetrics,
  AnalysisMode,
  AnalysisReport,
  ChangedFile,
  RepositoryInfo,
} from '../../shared/contracts.ts'
import { getDomain, getFileType, getSensitiveCategories } from './classifier.ts'
import { collectGitChanges, getRepositoryInfo } from './git.ts'
import { calculateRisk } from './scoring.ts'

function buildMetrics(files: ChangedFile[]): AnalysisMetrics {
  const domains = new Set<string>()
  const fileTypes: Record<string, number> = {}
  let additions = 0
  let deletions = 0

  for (const file of files) {
    domains.add(file.domain)
    fileTypes[file.fileType] = (fileTypes[file.fileType] ?? 0) + 1
    additions += file.additions ?? 0
    deletions += file.deletions ?? 0
  }

  return {
    filesChanged: files.length,
    additions,
    deletions,
    linesChanged: additions + deletions,
    domains: [...domains].sort(),
    fileTypes: Object.fromEntries(Object.entries(fileTypes).sort(([left], [right]) => left.localeCompare(right))),
  }
}

function buildSummary(report: Pick<AnalysisReport, 'metrics' | 'risk' | 'signals'>): string {
  if (report.metrics.filesChanged === 0) {
    return 'Aucun changement suivi détecté pour ce mode. Le score est faible, mais les fichiers non suivis restent exclus de la v1.'
  }

  const scope = `${report.metrics.filesChanged} fichier${report.metrics.filesChanged > 1 ? 's' : ''}, ${report.metrics.linesChanged} lignes et ${report.metrics.domains.length} domaine${report.metrics.domains.length > 1 ? 's' : ''}`
  const signalSummary = report.signals.length > 0
    ? ` Principaux signaux : ${report.signals.slice(0, 3).map((signal) => signal.label.toLowerCase()).join(', ')}.`
    : ' Aucun signal pondéré supplémentaire n’a été déclenché.'

  return `Risque ${report.risk.label.toLowerCase()} : ${scope}.${signalSummary}`
}

function toChangedFiles(changes: Awaited<ReturnType<typeof collectGitChanges>>): ChangedFile[] {
  return changes.map((change) => ({
    ...change,
    domain: getDomain(change.path),
    fileType: getFileType(change.path),
    sensitiveCategories: getSensitiveCategories(change.path),
  })).sort((left, right) => left.path.localeCompare(right.path))
}

export async function analyzeRepository(
  repositoryPath: string,
  mode: AnalysisMode,
  now: () => Date = () => new Date(),
): Promise<AnalysisReport> {
  const repository = await getRepositoryInfo(repositoryPath)
  return analyzeRepositoryWithInfo(repository, mode, now)
}

export async function analyzeRepositoryWithInfo(
  repository: RepositoryInfo,
  mode: AnalysisMode,
  now: () => Date = () => new Date(),
): Promise<AnalysisReport> {
  const files = toChangedFiles(await collectGitChanges(repository.root, mode))
  const metrics = buildMetrics(files)
  const { risk, signals } = calculateRisk(metrics, files)
  const partialReport = { metrics, risk, signals }

  return {
    repository,
    mode,
    analyzedAt: now().toISOString(),
    metrics,
    files,
    signals,
    risk,
    summary: buildSummary(partialReport),
  }
}

