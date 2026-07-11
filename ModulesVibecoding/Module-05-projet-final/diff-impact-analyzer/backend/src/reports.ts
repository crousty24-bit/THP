import type { AnalysisReport, ChangedFile } from '../../shared/contracts.ts'

const STATUS_LABEL: Record<ChangedFile['status'], string> = {
  added: 'A',
  copied: 'C',
  deleted: 'D',
  modified: 'M',
  renamed: 'R',
  'type-changed': 'T',
  unknown: '?',
}

function lineValue(value: number | null): string {
  return value === null ? 'binary' : String(value)
}

export function renderTextReport(report: AnalysisReport): string {
  const branch = report.repository.branch ?? 'detached HEAD'
  const lines = [
    'Diff Impact Analyzer',
    `Repository : ${report.repository.root} (${branch})`,
    `Mode       : ${report.mode}`,
    '',
    'Metrics',
    `- Files changed : ${report.metrics.filesChanged}`,
    `- Lines         : +${report.metrics.additions} / -${report.metrics.deletions}`,
    `- Domains       : ${report.metrics.domains.join(', ') || 'none'}`,
    `- File types    : ${Object.entries(report.metrics.fileTypes).map(([type, count]) => `${type} (${count})`).join(', ') || 'none'}`,
    '',
    `Risk score : ${report.risk.score}/100 — ${report.risk.label.toUpperCase()}`,
    '',
    'Signals',
    ...(report.signals.length > 0
      ? report.signals.map((signal) => `- +${signal.points} ${signal.label}: ${signal.reason}`)
      : ['- No weighted signal detected.']),
    '',
    'Files',
    ...(report.files.length > 0
      ? report.files.map((file) => `- ${STATUS_LABEL[file.status]} ${file.path} (+${lineValue(file.additions)} / -${lineValue(file.deletions)})`)
      : ['- No tracked change detected.']),
    '',
    'Summary',
    report.summary,
    '',
    'This score measures change scope, not code quality. Review the diff and run the relevant tests.',
  ]

  return `${lines.join('\n')}\n`
}

function escapeMarkdown(value: string): string {
  return value.replaceAll('|', '\\|')
}

export function renderMarkdownReport(report: AnalysisReport): string {
  const branch = report.repository.branch ?? 'detached HEAD'
  const signalRows = report.signals.length > 0
    ? report.signals.map((signal) => `| +${signal.points} | ${escapeMarkdown(signal.label)} | ${escapeMarkdown(signal.reason)} |`)
    : ['| 0 | No weighted signal | No threshold or sensitive-path rule was triggered. |']
  const fileRows = report.files.length > 0
    ? report.files.map((file) => `| ${STATUS_LABEL[file.status]} | \`${escapeMarkdown(file.path)}\` | ${file.domain} | +${lineValue(file.additions)} | -${lineValue(file.deletions)} |`)
    : ['| — | No tracked change | — | 0 | 0 |']

  return [
    '# Diff Impact Analyzer',
    '',
    `- **Repository:** \`${report.repository.root}\` (${branch})`,
    `- **Mode:** ${report.mode}`,
    `- **Analyzed at:** ${report.analyzedAt}`,
    '',
    '## Metrics',
    '',
    `- Files changed: **${report.metrics.filesChanged}**`,
    `- Lines: **+${report.metrics.additions} / -${report.metrics.deletions}**`,
    `- Domains: ${report.metrics.domains.join(', ') || 'none'}`,
    '',
    `## Risk: ${report.risk.score}/100 — ${report.risk.label}`,
    '',
    '| Points | Signal | Reason |',
    '| ---: | --- | --- |',
    ...signalRows,
    '',
    '## Files',
    '',
    '| Status | Path | Domain | Additions | Deletions |',
    '| --- | --- | --- | ---: | ---: |',
    ...fileRows,
    '',
    '## Summary',
    '',
    report.summary,
    '',
    '> This score measures change scope, not code quality. Review the diff and run the relevant tests.',
    '',
  ].join('\n')
}

