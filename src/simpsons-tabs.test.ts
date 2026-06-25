import { describe, expect, it } from 'vitest'
import { isSimpsonsTabId, simpsonsTabSchema } from './simpsons-tabs.ts'

describe('simpsonsTabSchema', () => {
	it('defaults to episodes when input is undefined', () => {
		expect(simpsonsTabSchema.parse(undefined)).toBe('episodes')
	})

	it('parses valid tab ids', () => {
		expect(simpsonsTabSchema.parse('characters')).toBe('characters')
		expect(simpsonsTabSchema.parse('locations')).toBe('locations')
	})

	it('falls back to episodes for invalid values', () => {
		expect(simpsonsTabSchema.parse('invalid')).toBe('episodes')
	})
})

describe('isSimpsonsTabId', () => {
	it('returns true for valid tab ids', () => {
		expect(isSimpsonsTabId('episodes')).toBe(true)
		expect(isSimpsonsTabId('characters')).toBe(true)
		expect(isSimpsonsTabId('locations')).toBe(true)
	})

	it('returns false for null, undefined, and invalid strings', () => {
		expect(isSimpsonsTabId(null)).toBe(false)
		expect(isSimpsonsTabId(undefined)).toBe(false)
		expect(isSimpsonsTabId('invalid')).toBe(false)
	})
})
