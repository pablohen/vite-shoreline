// @vitest-environment jsdom
import { waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SIMPSONS_PAGE_SIZE } from '../simpsons-api.ts'
import { renderHookWithQueryClient } from '../test-utils.tsx'
import {
	getListPagination,
	useSimpsonsListQuery,
} from './use-simpsons-list-query.ts'

const episodeListItem = {
	id: 1,
	name: 'Simpsons Roasting on an Open Fire',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Christmas special.',
	image_path: '/episodes/1.jpg',
}

const validEpisodesList = {
	count: 1,
	pages: 1,
	results: [episodeListItem],
}

function mockFetchResponse(body: unknown, ok = true, status = 200) {
	return {
		ok,
		status,
		statusText: ok ? 'OK' : 'Not Found',
		json: () => Promise.resolve(body),
	} as Response
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('getListPagination', () => {
	it('defaults total to 0 when count is undefined', () => {
		const onPageChange = vi.fn()
		const result = getListPagination(1, undefined, false, onPageChange)

		expect(result.total).toBe(0)
	})

	it('passes through count when provided', () => {
		const onPageChange = vi.fn()
		const result = getListPagination(2, 42, false, onPageChange)

		expect(result).toEqual({
			page: 2,
			total: 42,
			size: SIMPSONS_PAGE_SIZE,
			loading: false,
			onPageChange,
		})
	})

	it('mirrors isFetching into loading', () => {
		const onPageChange = vi.fn()
		expect(getListPagination(1, 10, true, onPageChange).loading).toBe(true)
		expect(getListPagination(1, 10, false, onPageChange).loading).toBe(false)
	})

	it('preserves onPageChange reference', () => {
		const onPageChange = vi.fn()
		expect(getListPagination(1, 10, false, onPageChange).onPageChange).toBe(
			onPageChange,
		)
	})
})

describe('useSimpsonsListQuery', () => {
	it('fetches data when enabled', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(mockFetchResponse(validEpisodesList))
		vi.stubGlobal('fetch', fetchMock)

		const { result } = renderHookWithQueryClient(() =>
			useSimpsonsListQuery('episodes', 1, true),
		)

		await waitFor(() => expect(result.current.isSuccess).toBe(true))
		expect(result.current.data?.results).toHaveLength(1)
		expect(fetchMock).toHaveBeenCalledWith(
			'https://thesimpsonsapi.com/api/episodes?page=1',
		)
	})

	it('does not fetch when disabled', async () => {
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock)

		const { result } = renderHookWithQueryClient(() =>
			useSimpsonsListQuery('episodes', 1, false),
		)

		await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
		expect(result.current.isPending).toBe(true)
		expect(fetchMock).not.toHaveBeenCalled()
	})
})
