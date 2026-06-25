// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useBrowseDrawerState } from './use-browse-drawer-state.ts'
import type { BrowseListResults } from './use-simpsons-browse-queries.ts'

const episodePreview = {
	id: 1,
	name: 'Episode One',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Synopsis',
	image_path: '/episodes/1.jpg',
}

const characterPreview = {
	id: 2,
	name: 'Homer',
	status: 'Alive',
	gender: 'Male',
	portrayed_by: 'Dan Castellaneta',
	image_path: '/characters/2.jpg',
}

const locationPreview = {
	id: 3,
	name: 'Springfield',
	town: 'Springfield',
	state: 'Unknown',
	image_path: '/locations/3.jpg',
}

const emptyListResults: BrowseListResults = {
	episodes: [],
	characters: [],
	locations: [],
}

const listResults: BrowseListResults = {
	episodes: [episodePreview],
	characters: [characterPreview],
	locations: [locationPreview],
}

describe('useBrowseDrawerState', () => {
	it('returns null when detail is undefined', () => {
		const { result } = renderHook(() =>
			useBrowseDrawerState(undefined, 'episodes', listResults),
		)

		expect(result.current).toBeNull()
	})

	it('finds episode preview from list results', async () => {
		const { result } = renderHook(() =>
			useBrowseDrawerState(1, 'episodes', listResults),
		)

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'episode',
				id: 1,
				preview: episodePreview,
			})
		})
	})

	it('returns null preview when id is not in list', async () => {
		const { result } = renderHook(() =>
			useBrowseDrawerState(99, 'episodes', listResults),
		)

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'episode',
				id: 99,
				preview: null,
			})
		})
	})

	it('uses character kind for characters tab', async () => {
		const { result } = renderHook(() =>
			useBrowseDrawerState(2, 'characters', listResults),
		)

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'character',
				id: 2,
				preview: characterPreview,
			})
		})
	})

	it('uses location kind for locations tab', async () => {
		const { result } = renderHook(() =>
			useBrowseDrawerState(3, 'locations', listResults),
		)

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'location',
				id: 3,
				preview: locationPreview,
			})
		})
	})

	it('updates preview when list results change', async () => {
		const { result, rerender } = renderHook(
			({ results }) => useBrowseDrawerState(1, 'episodes', results),
			{ initialProps: { results: emptyListResults } },
		)

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'episode',
				id: 1,
				preview: null,
			})
		})

		rerender({ results: listResults })

		await waitFor(() => {
			expect(result.current).toEqual({
				kind: 'episode',
				id: 1,
				preview: episodePreview,
			})
		})
	})

	it('clears drawer when detail becomes undefined', async () => {
		const { result, rerender } = renderHook(
			({ detail }: { detail: number | undefined }) =>
				useBrowseDrawerState(detail, 'episodes', listResults),
			{ initialProps: { detail: 1 as number | undefined } },
		)

		await waitFor(() => {
			expect(result.current).not.toBeNull()
		})

		rerender({ detail: undefined })

		await waitFor(() => {
			expect(result.current).toBeNull()
		})
	})
})
