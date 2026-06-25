// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDetailDrawerContent } from './use-detail-drawer-content.ts'

const episodePreview = {
	id: 1,
	name: 'Preview Name',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Preview synopsis',
	image_path: '/episodes/1.jpg',
}

const episodeDetail = {
	id: 1,
	name: 'Detail Name',
	description: 'Full description',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Synopsis',
	image_path: '/episodes/1.jpg',
	characters: [],
}

vi.mock('./use-simpsons-detail-query.ts', () => ({
	useSimpsonsDetailQueryImpl: vi.fn(),
}))

import { useSimpsonsDetailQueryImpl } from './use-simpsons-detail-query.ts'

const mockUseSimpsonsDetailQueryImpl = vi.mocked(useSimpsonsDetailQueryImpl)

describe('useDetailDrawerContent', () => {
	it('returns assembled content when query succeeds', () => {
		mockUseSimpsonsDetailQueryImpl.mockReturnValue({
			data: episodeDetail,
			isPending: false,
			isError: false,
			error: null,
		} as ReturnType<typeof useSimpsonsDetailQueryImpl>)

		const { result } = renderHook(() =>
			useDetailDrawerContent(
				'episodes',
				1,
				episodePreview,
				'Episode',
				'Failed to load episode',
			),
		)

		expect(result.current.title).toBe('Preview Name')
		expect(result.current.display).toBe(episodeDetail)
		expect(result.current.descriptionText).toBe('Full description')
		expect(result.current.hasContent).toBe(true)
	})

	it('returns pending state from query', () => {
		mockUseSimpsonsDetailQueryImpl.mockReturnValue({
			data: undefined,
			isPending: true,
			isError: false,
			error: null,
		} as ReturnType<typeof useSimpsonsDetailQueryImpl>)

		const { result } = renderHook(() =>
			useDetailDrawerContent(
				'episodes',
				1,
				episodePreview,
				'Episode',
				'Failed to load episode',
			),
		)

		expect(result.current.isPending).toBe(true)
		expect(result.current.display).toBe(episodePreview)
	})

	it('returns error message when query fails', () => {
		mockUseSimpsonsDetailQueryImpl.mockReturnValue({
			data: undefined,
			isPending: false,
			isError: true,
			error: new Error('Network failed'),
		} as ReturnType<typeof useSimpsonsDetailQueryImpl>)

		const { result } = renderHook(() =>
			useDetailDrawerContent(
				'episodes',
				1,
				episodePreview,
				'Episode',
				'Failed to load episode',
			),
		)

		expect(result.current.errorMessage).toBe('Network failed')
	})
})
