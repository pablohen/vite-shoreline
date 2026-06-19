import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import type {
	CharacterListItem,
	CharactersListResponse,
	EpisodeListItem,
	EpisodesListResponse,
	LocationListItem,
	LocationsListResponse,
} from '../simpsons-api.ts'
import type { SimpsonsTabId } from '../simpsons-tabs.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import {
	getListPagination,
	useSimpsonsListQuery,
} from './use-simpsons-list-query.ts'

export type BrowseListResults = {
	episodes: EpisodeListItem[]
	characters: CharacterListItem[]
	locations: LocationListItem[]
}

export type BrowseQueries = {
	episodes: UseQueryResult<EpisodesListResponse>
	characters: UseQueryResult<CharactersListResponse>
	locations: UseQueryResult<LocationsListResponse>
}

export function useSimpsonsBrowseQueries(tab: SimpsonsTabId, page: number) {
	const episodes = useSimpsonsListQuery('episodes', page, tab === 'episodes')
	const characters = useSimpsonsListQuery(
		'characters',
		page,
		tab === 'characters',
	)
	const locations = useSimpsonsListQuery('locations', page, tab === 'locations')

	const queries: BrowseQueries = { episodes, characters, locations }

	const listResults = useMemo<BrowseListResults>(
		() => ({
			episodes: episodes.data?.results ?? [],
			characters: characters.data?.results ?? [],
			locations: locations.data?.results ?? [],
		}),
		[episodes.data?.results, characters.data?.results, locations.data?.results],
	)

	return { queries, listResults }
}

export function getTabPanelQueryState(
	query: UseQueryResult<
		EpisodesListResponse | CharactersListResponse | LocationsListResponse,
		Error
	>,
	errorLabel: string,
	page: number,
	onPageChange: (page: number) => void,
) {
	return {
		listError: getErrorMessage(query.isError, query.error, errorLabel),
		isPending: query.isPending,
		isFetching: query.isFetching,
		isError: query.isError,
		onRefetch: query.refetch,
		pagination: getListPagination(
			page,
			query.data?.count,
			query.isFetching,
			onPageChange,
		),
	}
}
