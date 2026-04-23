import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps } from 'react'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'
import { EpisodesTable } from './EpisodesTable.tsx'

export type EpisodesTabPanelProps = {
	pagination: ComponentProps<typeof Pagination>
	episodes: EpisodeListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onEpisodeSelect: (episode: EpisodeListItem) => void
}

export function EpisodesTabPanel({
	pagination,
	episodes,
	listError,
	isPending,
	isFetching,
	isError,
	onRefetch,
	onEpisodeSelect,
}: EpisodesTabPanelProps) {
	return (
		<Collection>
			<CollectionRow justify="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>

			<CollectionView
				status={getCollectionViewStatus(
					listError,
					isPending,
					isFetching,
					episodes.length,
				)}
				messages={
					listError
						? {
								'error-heading': listError,
								'error-action': 'Try again',
							}
						: !isPending && !isError && episodes.length === 0
							? {
									'empty-heading': 'No episodes',
									'empty-description': 'There are no episodes to show.',
								}
							: undefined
				}
				onError={onRefetch}
			>
				<EpisodesTable episodes={episodes} onEpisodeSelect={onEpisodeSelect} />
			</CollectionView>

			<CollectionRow align="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>
		</Collection>
	)
}
