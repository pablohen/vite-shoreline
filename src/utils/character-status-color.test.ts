import { describe, expect, it } from 'vitest'
import { characterStatusColor } from './character-status-color.ts'

describe('characterStatusColor', () => {
	it('returns green for alive status', () => {
		expect(characterStatusColor('alive')).toBe('green')
		expect(characterStatusColor('Alive')).toBe('green')
	})

	it('returns red for deceased status', () => {
		expect(characterStatusColor('deceased')).toBe('red')
		expect(characterStatusColor('Deceased')).toBe('red')
	})

	it('returns gray for other statuses', () => {
		expect(characterStatusColor('unknown')).toBe('gray')
		expect(characterStatusColor('')).toBe('gray')
	})
})
