import {
	Alert,
	DrawerProvider,
	Page,
	PageContent,
	PageHeader,
	PageHeading,
	Spinner,
	Stack,
} from '@vtex/shoreline'
import { useCallback, useEffect, useState } from 'react'
import { EpisodeDetailsDrawer } from './EpisodeDetailsDrawer.tsx'
import { EpisodesTable } from './EpisodesTable.tsx'
import { type EpisodeListItem, fetchEpisodesPage } from './simpsons-api.ts'

export function EpisodesPage() {
	const [page, setPage] = useState(1)
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
	}, [page])

	return (
		<DrawerProvider open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
			<Page>
				<PageHeader>
					<PageHeading>The Simpsons — Episodes</PageHeading>
				</PageHeader>
				<PageContent>
					<Stack space="$space-6">
						{listError ? <Alert variant="critical">{listError}</Alert> : null}

						{listLoading && episodes.length === 0 ? (
							<Spinner size={24} description="Loading episodes" />
						) : (
							<EpisodesTable
								episodes={episodes}
								page={page}
								totalCount={totalCount}
								listLoading={listLoading}
								onPageChange={setPage}
								onEpisodeSelect={(episode) => {
									setSelectedId(episode.id)
									setSelectedPreview(episode)
								}}
							/>
						)}
					</Stack>
				</PageContent>
			</Page>

			<EpisodeDetailsDrawer episodeId={selectedId} preview={selectedPreview} />
		</DrawerProvider>
	)
}
