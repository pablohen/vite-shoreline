import { describe, expect, it } from 'vitest'
import { getCollectionViewStatus } from './collection-view-status.ts'

describe('getCollectionViewStatus', () => {
	it('returns error when listError is set', () => {
		expect(getCollectionViewStatus('Failed to load', false, false, 5)).toBe(
			'error',
		)
	})

	it('returns loading when pending with no rows', () => {
		expect(getCollectionViewStatus(null, true, false, 0)).toBe('loading')
	})

	it('returns empty when settled with no rows', () => {
		expect(getCollectionViewStatus(null, false, false, 0)).toBe('empty')
	})

	it('returns ready when data is available', () => {
		expect(getCollectionViewStatus(null, false, false, 3)).toBe('ready')
	})

	it('returns ready while refetching with existing rows', () => {
		expect(getCollectionViewStatus(null, false, true, 3)).toBe('ready')
	})
})
