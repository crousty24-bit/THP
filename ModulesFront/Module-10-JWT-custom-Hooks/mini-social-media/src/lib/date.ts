const relativeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'short',
})

const units = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const

export function formatRelativeDate(value: string) {
  const timestamp = Date.parse(value)

  if (!Number.isFinite(timestamp)) {
    return 'Just now'
  }

  const elapsedSeconds = Math.round((timestamp - Date.now()) / 1000)
  const match = units.find(([, seconds]) => Math.abs(elapsedSeconds) >= seconds)

  if (!match) {
    return 'Just now'
  }

  const [unit, seconds] = match

  return relativeFormatter.format(Math.round(elapsedSeconds / seconds), unit)
}
