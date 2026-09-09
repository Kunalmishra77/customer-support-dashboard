import { describe, expect, it } from 'vitest'
import { formatRelative } from '@/lib/date'

// `now` is injectable precisely so this needs no clock mocking.
const NOW = new Date('2026-09-09T12:00:00.000Z').getTime()
const ago = (ms: number) => new Date(NOW - ms).toISOString()

describe('formatRelative', () => {
  it('collapses anything under a minute to "just now"', () => {
    expect(formatRelative(ago(30_000), NOW)).toBe('just now')
  })

  it('reports minutes, hours and days with a consistent shape', () => {
    expect(formatRelative(ago(45 * 60_000), NOW)).toBe('45m ago')
    expect(formatRelative(ago(2 * 3_600_000), NOW)).toBe('2h ago')
    expect(formatRelative(ago(3 * 86_400_000), NOW)).toBe('3d ago')
  })

  it('says "1d ago" rather than "yesterday", so the column stays scannable', () => {
    expect(formatRelative(ago(86_400_000), NOW)).toBe('1d ago')
  })
})
