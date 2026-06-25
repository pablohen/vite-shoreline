import { describe, expect, it } from 'vitest'
import { formatAirdate } from './format-airdate.ts'

describe('formatAirdate', () => {
	it('returns em dash for empty string', () => {
		expect(formatAirdate('')).toBe('—')
	})

	it('returns em dash for whitespace-only string', () => {
		expect(formatAirdate('   ')).toBe('—')
	})

	it('formats a valid ISO date string', () => {
		const value = '2020-01-15'
		const expected = new Date(value).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
		})
		expect(formatAirdate(value)).toBe(expected)
	})
})
