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

  it.each([
    [5, 0],
    [6, 10],
    [10, 10],
    [11, 20],
    [20, 20],
    [21, 30],
  ])('scores the file-count boundary %i as %i', (filesChanged, expected) => {
    expect(calculateRisk(metrics({ filesChanged }), []).risk.score).toBe(expected)
  })

  it.each([
    [2, 0],
    [3, 10],
    [4, 10],
    [5, 20],
  ])('scores the domain-count boundary %i as %i', (domainCount, expected) => {
    const domains = Array.from({ length: domainCount }, (_, index) => `domain-${index}`)
    expect(calculateRisk(metrics({ domains }), []).risk.score).toBe(expected)
  })

  it('caps sensitive categories at forty points', () => {
    const result = calculateRisk(
      metrics({ filesChanged: 1, linesChanged: 1, domains: ['src'] }),
      [sensitiveFile(['database', 'dependencies', 'infrastructure', 'security'])],
    )

    expect(result.risk.score).toBe(40)
    expect(result.signals.reduce((total, signal) => total + signal.points, 0)).toBe(40)
  })

  it('caps the global score at one hundred and keeps signal ordering stable', () => {
    const result = calculateRisk(
      metrics({
        filesChanged: 21,
        linesChanged: 801,
        domains: ['a', 'b', 'c', 'd', 'e'],
      }),
      [sensitiveFile(['database', 'security'])],
    )

    expect(result.risk.score).toBe(100)
    expect(result.signals.map((signal) => signal.id)).toEqual([
      'diff-volume',
      'file-count',
      'sensitive-database',
      'domain-spread',
      'sensitive-security',
    ])
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
