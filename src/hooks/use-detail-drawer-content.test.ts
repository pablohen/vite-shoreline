import { describe, expect, it } from 'vitest'
import { buildDetailDrawerContent } from './use-detail-drawer-content.ts'

const episodeDetail = {
	id: 1,
	name: 'Detail Name',
	description: '  Full description  ',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Synopsis',
	image_path: '/episodes/1.jpg',
	characters: [],
}

const episodePreview = {
	id: 1,
	name: 'Preview Name',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Preview synopsis',
	image_path: '/episodes/1.jpg',
}

describe('buildDetailDrawerContent', () => {
	it('uses data as display and preview name as title when both exist', () => {
		const result = buildDetailDrawerContent(
			episodeDetail,
			episodePreview,
			false,
			false,
			null,
			'Episode',
			'Failed to load episode',
		)

		expect(result.display).toBe(episodeDetail)
		expect(result.title).toBe('Preview Name')
		expect(result.descriptionText).toBe('Full description')
		expect(result.hasContent).toBe(true)
	})

	it('uses preview when data is missing', () => {
		const result = buildDetailDrawerContent(
			undefined,
			episodePreview,
			true,
			false,
			null,
			'Episode',
			'Failed to load episode',
		)

		expect(result.display).toBe(episodePreview)
		expect(result.title).toBe('Preview Name')
		expect(result.hasContent).toBe(true)
		expect(result.isPending).toBe(true)
	})

	it('falls back to default title when neither data nor preview exist', () => {
		const result = buildDetailDrawerContent(
			undefined,
			null,
			false,
			false,
			null,
			'Episode',
			'Failed to load episode',
		)

		expect(result.title).toBe('Episode')
		expect(result.hasContent).toBe(false)
	})

	it('returns undefined descriptionText for whitespace-only descriptions', () => {
		const result = buildDetailDrawerContent(
			{ ...episodeDetail, description: '   ' },
			null,
			false,
			false,
			null,
			'Episode',
			'Failed to load episode',
		)

		expect(result.descriptionText).toBeUndefined()
	})

	it('returns error message when query failed', () => {
		const result = buildDetailDrawerContent(
			undefined,
			episodePreview,
			false,
			true,
			new Error('Network failed'),
			'Episode',
			'Failed to load episode',
		)

		expect(result.errorMessage).toBe('Network failed')
	})
})
