import type { UseQueryResult } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import type {
	CharactersListResponse,
	EpisodesListResponse,
	LocationsListResponse,
} from '../simpsons-api.ts'
import { getTabPanelQueryState } from './use-simpsons-browse-queries.ts'

function createMockQuery(
	overrides: Partial<
		UseQueryResult<
			EpisodesListResponse | CharactersListResponse | LocationsListResponse,
			Error
		>
	> = {},
): UseQueryResult<
	EpisodesListResponse | CharactersListResponse | LocationsListResponse,
	Error
> {
	return {
		isError: false,
		isPending: false,
		isFetching: false,
		error: null,
		data: undefined,
		refetch: vi.fn(),
		...overrides,
	} as UseQueryResult<
		EpisodesListResponse | CharactersListResponse | LocationsListResponse,
		Error
	>
}

describe('getTabPanelQueryState', () => {
	it('returns listError when query is in error state', () => {
		const onPageChange = vi.fn()
		const refetch = vi.fn()
		const query = createMockQuery({
			isError: true,
			error: new Error('Network failed'),
			refetch,
		})

		const result = getTabPanelQueryState(
			query,
			'Failed to load episodes',
			2,
			onPageChange,
		)

		expect(result.listError).toBe('Network failed')
		expect(result.isError).toBe(true)
		expect(result.onRefetch).toBe(refetch)
	})

	it('returns null listError on success and wires pagination', () => {
		const onPageChange = vi.fn()
		const query = createMockQuery({
			isFetching: true,
			data: { count: 100, pages: 5, results: [] },
		})

		const result = getTabPanelQueryState(
			query,
			'Failed to load episodes',
			3,
			onPageChange,
		)

		expect(result.listError).toBeNull()
		expect(result.isPending).toBe(false)
		expect(result.isFetching).toBe(true)
		expect(result.pagination).toEqual({
			page: 3,
			total: 100,
			size: 20,
			loading: true,
			onPageChange,
		})
	})
})
