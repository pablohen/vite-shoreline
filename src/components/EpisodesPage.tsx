import { useQuery } from '@tanstack/react-query'
import {
	Collection,
	CollectionRow,
	CollectionView,
	DrawerProvider,
	Page,
	PageContent,
	PageHeader,
	PageHeading,
	Pagination,
} from '@vtex/shoreline'
import { type ComponentProps, useState } from 'react'
import { type EpisodeListItem, fetchEpisodesPage } from '../simpsons-api.ts'
import { EpisodeDetailsDrawer } from './EpisodeDetailsDrawer.tsx'
import { EPISODES_PAGE_SIZE, EpisodesTable } from './EpisodesTable.tsx'

export type EpisodesPageProps = {
	page: number
	onPageChange: (page: number) => void
}

export function EpisodesPage({ page, onPageChange }: EpisodesPageProps) {
	const { data, isPending, isError, isFetching, error, refetch } = useQuery({
		queryKey: ['episodes', 'list', page] as const,
		queryFn: () => fetchEpisodesPage(page),
	})

	const episodes = data?.results ?? []
	const totalCount = data?.count ?? 0
	const listError = isError
		? error instanceof Error
			? error.message
			: 'Failed to load episodes'
		: null

	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [selectedPreview, setSelectedPreview] =
		useState<EpisodeListItem | null>(null)

	const drawerOpen = selectedId !== null

	function handleDrawerOpenChange(open: boolean) {
		if (!open) {
			setSelectedId(null)
			setSelectedPreview(null)
		}
	}
	const getCollectionStatus = () => {
		if (listError) {
			return 'error'
		} else if (isPending && episodes.length === 0) {
			return 'loading'
		} else if (
			!isPending &&
			!isFetching &&
			!listError &&
			episodes.length === 0
		) {
			return 'empty'
		} else {
			return 'ready'
		}
	}

	const getCollectionMessages = () => {
		if (listError) {
			return {
				'error-heading': listError,
				'error-action': 'Try again',
			}
		} else if (!isPending && !isError && episodes.length === 0) {
			return {
				'empty-heading': 'No episodes',
				'empty-description': 'There are no episodes to show.',
			}
		}
	}

	const paginationProps: ComponentProps<typeof Pagination> = {
		page,
		total: totalCount,
		size: EPISODES_PAGE_SIZE,
		loading: isFetching,
		onPageChange,
	}

	return (
		<Page>
			<PageHeader>
				<PageHeading>The Simpsons — Episodes</PageHeading>
			</PageHeader>

			<PageContent>
				<Collection>
					<CollectionRow justify="flex-end">
						<Pagination {...paginationProps} />
					</CollectionRow>

					<CollectionView
						status={getCollectionStatus()}
						messages={getCollectionMessages()}
						onError={refetch}
					>
						<EpisodesTable
							episodes={episodes}
							onEpisodeSelect={(episode) => {
								setSelectedId(episode.id)
								setSelectedPreview(episode)
							}}
						/>
					</CollectionView>

					<CollectionRow align="flex-end">
						<Pagination {...paginationProps} />
					</CollectionRow>
				</Collection>
			</PageContent>

			<DrawerProvider open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
				<EpisodeDetailsDrawer
					episodeId={selectedId}
					preview={selectedPreview}
				/>
			</DrawerProvider>
		</Page>
	)
}
