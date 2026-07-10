import { describe, expect, it } from 'vitest'

import type { AnalysisMetrics, ChangedFile } from '../../shared/contracts.ts'
import { calculateRisk, getRiskAssessment } from '../src/scoring.ts'

function metrics(overrides: Partial<AnalysisMetrics> = {}): AnalysisMetrics {
  return {
    filesChanged: 0,
    additions: 0,
    deletions: 0,
    linesChanged: 0,
    domains: [],
    fileTypes: {},
    ...overrides,
  }
}

function sensitiveFile(categories: ChangedFile['sensitiveCategories']): ChangedFile {
  return {
    status: 'modified',
    path: 'src/auth.ts',
    previousPath: null,
    domain: 'src',
    fileType: '.ts',
    additions: 1,
    deletions: 0,
    binary: false,
    sensitiveCategories: categories,
  }
}

describe('risk scoring', () => {
  it.each([
    [100, 0],
    [101, 15],
    [300, 15],
    [301, 30],
    [800, 30],
    [801, 50],
  ])('scores the line boundary %i as %i', (linesChanged, expected) => {
    expect(calculateRisk(metrics({ linesChanged }), []).risk.score).toBe(expected)
  })

  it('caps sensitive categories at forty points', () => {
    const result = calculateRisk(
      metrics({ filesChanged: 1, linesChanged: 1, domains: ['src'] }),
      [sensitiveFile(['database', 'dependencies', 'infrastructure', 'security'])],
    )

    expect(result.risk.score).toBe(40)
    expect(result.signals.reduce((total, signal) => total + signal.points, 0)).toBe(40)
  })

  it.each([
    [19, 'low'],
    [20, 'medium'],
    [49, 'medium'],
    [50, 'high'],
  ])('maps score boundary %i to %s', (targetScore, expectedLevel) => {
    expect(getRiskAssessment(targetScore).level).toBe(expectedLevel)
  })
})
