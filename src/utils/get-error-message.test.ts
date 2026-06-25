import { describe, expect, it } from 'vitest'
import { getErrorMessage } from './get-error-message.ts'

describe('getErrorMessage', () => {
	it('returns null when not in error state', () => {
		expect(getErrorMessage(false, new Error('fail'), 'fallback')).toBeNull()
	})

	it('returns error message for Error instances', () => {
		expect(getErrorMessage(true, new Error('network down'), 'fallback')).toBe(
			'network down',
		)
	})

	it('returns fallback for non-Error values', () => {
		expect(getErrorMessage(true, 'oops', 'Something went wrong')).toBe(
			'Something went wrong',
		)
	})
})
