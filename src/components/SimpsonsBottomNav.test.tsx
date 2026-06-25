import { describe, expect, it } from 'vitest'
import { simpsonsPanelId } from './SimpsonsBottomNav.tsx'

describe('simpsonsPanelId', () => {
	it('returns a panel id for the tab', () => {
		expect(simpsonsPanelId('episodes')).toBe('simpsons-panel-episodes')
		expect(simpsonsPanelId('characters')).toBe('simpsons-panel-characters')
		expect(simpsonsPanelId('locations')).toBe('simpsons-panel-locations')
	})
})
