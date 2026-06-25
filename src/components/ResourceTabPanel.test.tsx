import { describe, expect, it } from 'vitest'
import {
	getResourceTabPanelMessages,
	shouldShowTableSkeleton,
} from './ResourceTabPanel.tsx'

describe('getResourceTabPanelMessages', () => {
	it('returns error messages when listError is set', () => {
		expect(
			getResourceTabPanelMessages(
				'Failed to load',
				false,
				true,
				0,
				1,
				'No episodes',
				'Try again later',
			),
		).toEqual({
			'error-heading': 'Failed to load',
			'error-action': 'Try again',
		})
	})

	it('returns default empty messages on page 1', () => {
		expect(
			getResourceTabPanelMessages(
				null,
				false,
				false,
				0,
				1,
				'No episodes',
				'Try again later',
			),
		).toEqual({
			'empty-heading': 'No episodes',
			'empty-description': 'Try again later',
		})
	})

	it('returns out-of-range page messages when page > 1 has no items', () => {
		expect(
			getResourceTabPanelMessages(
				null,
				false,
				false,
				0,
				3,
				'No episodes',
				'Try again later',
			),
		).toEqual({
			'empty-heading': 'Nothing on page 3',
			'empty-description': 'Try going back to a previous page.',
		})
	})

	it('returns undefined while pending or when items exist', () => {
		expect(
			getResourceTabPanelMessages(
				null,
				true,
				false,
				0,
				1,
				'No episodes',
				'Try again later',
			),
		).toBeUndefined()

		expect(
			getResourceTabPanelMessages(
				null,
				false,
				false,
				5,
				1,
				'No episodes',
				'Try again later',
			),
		).toBeUndefined()
	})
})

describe('shouldShowTableSkeleton', () => {
	it('shows skeleton when refetching with existing data', () => {
		expect(shouldShowTableSkeleton(true, false)).toBe(true)
	})

	it('hides skeleton on initial load', () => {
		expect(shouldShowTableSkeleton(true, true)).toBe(false)
	})
})
