import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
	type CharactersListResponse,
	type EpisodesListResponse,
	fetchPage,
	type LocationsListResponse,
	SIMPSONS_PAGE_SIZE,
	type SimpsonsResource,
} from '../simpsons-api.ts'

export function useSimpsonsListQuery(
	resource: 'episodes',
	page: number,
	enabled: boolean,
): UseQueryResult<EpisodesListResponse>
export function useSimpsonsListQuery(
	resource: 'characters',
	page: number,
	enabled: boolean,
): UseQueryResult<CharactersListResponse>
export function useSimpsonsListQuery(
	resource: 'locations',
	page: number,
	enabled: boolean,
): UseQueryResult<LocationsListResponse>
export function useSimpsonsListQuery(
	resource: SimpsonsResource,
	page: number,
	enabled: boolean,
): UseQueryResult<
	EpisodesListResponse | CharactersListResponse | LocationsListResponse
> {
	return useQuery<
		EpisodesListResponse | CharactersListResponse | LocationsListResponse,
		Error,
		EpisodesListResponse | CharactersListResponse | LocationsListResponse,
		readonly [SimpsonsResource, 'list', number]
	>({
		queryKey: [resource, 'list', page] as const,
		queryFn: () => {
			switch (resource) {
				case 'episodes':
					return fetchPage('episodes', page)
				case 'characters':
					return fetchPage('characters', page)
				case 'locations':
					return fetchPage('locations', page)
			}
		},
		enabled,
	})
}

export function getListPagination(
	page: number,
	count: number | undefined,
	isFetching: boolean,
	onPageChange: (page: number) => void,
) {
	return {
		page,
		total: count ?? 0,
		size: SIMPSONS_PAGE_SIZE,
		loading: isFetching,
		onPageChange,
	}
}
