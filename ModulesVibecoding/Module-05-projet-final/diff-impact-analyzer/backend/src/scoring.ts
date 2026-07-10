import type {
  AnalysisMetrics,
  ChangedFile,
  RiskAssessment,
  RiskSignal,
  SensitiveCategory,
} from '../../shared/contracts.ts'

const SENSITIVE_POINTS: Record<SensitiveCategory, number> = {
  database: 30,
  dependencies: 20,
  infrastructure: 25,
  security: 30,
}

const SENSITIVE_LABELS: Record<SensitiveCategory, string> = {
  database: 'Schéma ou migrations modifiés',
  dependencies: 'Dépendances modifiées',
  infrastructure: 'CI ou infrastructure modifiée',
  security: 'Authentification ou sécurité modifiée',
}

function thresholdPoints(value: number, thresholds: Array<[number, number]>): number {
  for (const [maximum, points] of thresholds) {
    if (value <= maximum) {
      return points
    }
  }

  return thresholds.at(-1)?.[1] ?? 0
}

export function getRiskAssessment(score: number): RiskAssessment {
  if (score >= 50) {
    return { score, level: 'high', label: 'Élevé' }
  }

  if (score >= 20) {
    return { score, level: 'medium', label: 'Moyen' }
  }

  return { score, level: 'low', label: 'Faible' }
}

function metricSignals(metrics: AnalysisMetrics): RiskSignal[] {
  const signals: RiskSignal[] = []
  const volumePoints = thresholdPoints(metrics.linesChanged, [
    [100, 0],
    [300, 15],
    [800, 30],
    [Number.POSITIVE_INFINITY, 50],
  ])
  const filePoints = thresholdPoints(metrics.filesChanged, [
    [5, 0],
    [10, 10],
    [20, 20],
    [Number.POSITIVE_INFINITY, 30],
  ])
  const domainPoints = thresholdPoints(metrics.domains.length, [
    [2, 0],
    [4, 10],
    [Number.POSITIVE_INFINITY, 20],
  ])

  if (volumePoints > 0) {
    signals.push({
      id: 'diff-volume',
      label: 'Diff volumineux',
      points: volumePoints,
      reason: `${metrics.linesChanged} lignes ont été ajoutées ou supprimées.`,
      paths: [],
    })
  }

  if (filePoints > 0) {
    signals.push({
      id: 'file-count',
      label: 'Nombre de fichiers élevé',
      points: filePoints,
      reason: `${metrics.filesChanged} fichiers sont concernés.`,
      paths: [],
    })
  }

  if (domainPoints > 0) {
    signals.push({
      id: 'domain-spread',
      label: 'Changement réparti sur plusieurs domaines',
      points: domainPoints,
      reason: `${metrics.domains.length} domaines de premier niveau sont concernés.`,
      paths: [],
    })
  }

  return signals
}

function sensitiveSignals(files: ChangedFile[]): RiskSignal[] {
  const pathsByCategory = new Map<SensitiveCategory, string[]>()

  for (const file of files) {
    for (const category of file.sensitiveCategories) {
      const paths = pathsByCategory.get(category) ?? []
      paths.push(file.path)
      pathsByCategory.set(category, paths)
    }
  }

  const categories = [...pathsByCategory.keys()].sort((left, right) => {
    const pointsDifference = SENSITIVE_POINTS[right] - SENSITIVE_POINTS[left]
    return pointsDifference || left.localeCompare(right)
  })
  let remainingPoints = 40

  return categories.flatMap((category) => {
    if (remainingPoints === 0) {
      return []
    }

    const awardedPoints = Math.min(SENSITIVE_POINTS[category], remainingPoints)
    const paths = [...new Set(pathsByCategory.get(category))].sort()
    remainingPoints -= awardedPoints

    return [{
      id: `sensitive-${category}`,
      label: SENSITIVE_LABELS[category],
      points: awardedPoints,
      reason: `${paths.length} fichier${paths.length > 1 ? 's' : ''} correspond${paths.length > 1 ? 'ent' : ''} à la règle ${category}.`,
      paths,
    }]
  })
}

export function calculateRisk(
  metrics: AnalysisMetrics,
  files: ChangedFile[],
): { risk: RiskAssessment; signals: RiskSignal[] } {
  const signals = [...metricSignals(metrics), ...sensitiveSignals(files)]
    .sort((left, right) => right.points - left.points || left.id.localeCompare(right.id))
  const score = Math.min(100, signals.reduce((total, signal) => total + signal.points, 0))

  return { signals, risk: getRiskAssessment(score) }
}
