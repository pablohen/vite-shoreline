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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { EpisodeDetailsDrawer } from './EpisodeDetailsDrawer.tsx'
import { EPISODES_PAGE_SIZE, EpisodesTable } from './EpisodesTable.tsx'
import { type EpisodeListItem, fetchEpisodesPage } from './simpsons-api.ts'

export type EpisodesPageProps = {
	page: number
	onPageChange: (page: number) => void
}

export function EpisodesPage({ page, onPageChange }: EpisodesPageProps) {
	const [retryCount, setRetryCount] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [episodes, setEpisodes] = useState<EpisodeListItem[]>([])
	const [listLoading, setListLoading] = useState(true)
	const [listError, setListError] = useState<string | null>(null)

	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [selectedPreview, setSelectedPreview] =
		useState<EpisodeListItem | null>(null)

	const drawerOpen = selectedId !== null

	const handleDrawerOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSelectedId(null)
			setSelectedPreview(null)
		}
	}, [])

	useEffect(() => {
		void retryCount
		let cancelled = false
		setListLoading(true)
		setListError(null)
		fetchEpisodesPage(page)
			.then((res) => {
				if (!cancelled) {
					setEpisodes(res.results)
					setTotalCount(res.count)
				}
			})
			.catch((e: unknown) => {
				if (!cancelled) {
					setListError(
						e instanceof Error ? e.message : 'Failed to load episodes',
					)
					setEpisodes([])
					setTotalCount(0)
				}
			})
			.finally(() => {
				if (!cancelled) {
					setListLoading(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [page, retryCount])

	const collectionStatus = useMemo(() => {
		if (listError) {
			return 'error' as const
		}
		if (listLoading && episodes.length === 0) {
			return 'loading' as const
		}
		if (!listLoading && !listError && episodes.length === 0) {
			return 'empty' as const
		}
		return 'ready' as const
	}, [listError, listLoading, episodes.length])

	const collectionMessages = useMemo(() => {
		if (listError) {
			return {
				'error-heading': listError,
				'error-action': 'Try again',
			}
		}
		if (!listLoading && !listError && episodes.length === 0) {
			return {
				'empty-heading': 'No episodes',
				'empty-description': 'There are no episodes to show.',
			}
		}
		return undefined
	}, [listError, listLoading, episodes.length])

	const paginationProps = {
		page,
		total: totalCount,
		size: EPISODES_PAGE_SIZE,
		loading: listLoading,
		onPageChange,
	}

	return (
		<DrawerProvider open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
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
							status={collectionStatus}
							messages={collectionMessages}
							onError={() => {
								setRetryCount((c) => c + 1)
							}}
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
			</Page>

			<EpisodeDetailsDrawer episodeId={selectedId} preview={selectedPreview} />
		</DrawerProvider>
	)
}
