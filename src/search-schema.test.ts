import { describe, expect, it } from 'vitest'
import { searchSchema } from './search-schema.ts'

describe('searchSchema', () => {
	it('defaults page and tab when input is empty', () => {
		expect(searchSchema.parse({})).toEqual({
			page: 1,
			tab: 'episodes',
		})
	})

	it('coerces string page values', () => {
		expect(searchSchema.parse({ page: '3' })).toEqual({
			page: 3,
			tab: 'episodes',
		})
	})

	it('falls back to page 1 for invalid page values', () => {
		expect(searchSchema.parse({ page: 0 }).page).toBe(1)
		expect(searchSchema.parse({ page: -1 }).page).toBe(1)
		expect(searchSchema.parse({ page: 'abc' }).page).toBe(1)
	})

	it('parses positive detail ids from strings', () => {
		expect(searchSchema.parse({ detail: '42' })).toEqual({
			page: 1,
			tab: 'episodes',
			detail: 42,
		})
	})

	it('strips invalid detail values', () => {
		expect(searchSchema.parse({ detail: 0 }).detail).toBeUndefined()
		expect(searchSchema.parse({ detail: -5 }).detail).toBeUndefined()
		expect(searchSchema.parse({ detail: 'x' }).detail).toBeUndefined()
	})

	it('preserves valid tab ids', () => {
		expect(searchSchema.parse({ tab: 'characters' }).tab).toBe('characters')
	})
})
