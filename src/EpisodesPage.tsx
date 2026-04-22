import type { ColumnDef } from '@tanstack/react-table'
import {
	Alert,
	DrawerContent,
	DrawerDismiss,
	DrawerHeader,
	DrawerHeading,
	DrawerPopover,
	DrawerProvider,
	Page,
	PageContent,
	PageHeader,
	PageHeading,
	Pagination,
	Spinner,
	Stack,
	Tag,
	Text,
} from '@vtex/shoreline'
import { TsTable } from '@vtex/shoreline-ts-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	type EpisodeDetail,
	type EpisodeListItem,
	episodeImageUrl,
	fetchEpisodeById,
	fetchEpisodesPage,
} from './simpsons-api.ts'

const PAGE_SIZE = 20

function formatAirdate(value: string): string {
	if (!value || value.trim() === '') {
		return '—'
	}
	return value
}

export function EpisodesPage() {
	const [page, setPage] = useState(1)
	const [totalCount, setTotalCount] = useState(0)
	const [episodes, setEpisodes] = useState<EpisodeListItem[]>([])
	const [listLoading, setListLoading] = useState(true)
	const [listError, setListError] = useState<string | null>(null)

	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [selectedPreview, setSelectedPreview] =
		useState<EpisodeListItem | null>(null)
	const [detail, setDetail] = useState<EpisodeDetail | null>(null)
	const [detailLoading, setDetailLoading] = useState(false)
	const [detailError, setDetailError] = useState<string | null>(null)

	const drawerOpen = selectedId !== null

	const handleDrawerOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setSelectedId(null)
			setSelectedPreview(null)
			setDetail(null)
			setDetailError(null)
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

	useEffect(() => {
		if (selectedId == null) {
			return
		}
		let cancelled = false
		setDetailLoading(true)
		setDetailError(null)
		fetchEpisodeById(selectedId)
			.then((d) => {
				if (!cancelled) {
					setDetail(d)
				}
			})
			.catch((e: unknown) => {
				if (!cancelled) {
					setDetailError(
						e instanceof Error ? e.message : 'Failed to load episode details',
					)
					setDetail(null)
				}
			})
			.finally(() => {
				if (!cancelled) {
					setDetailLoading(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [selectedId])

	const columns = useMemo<ColumnDef<EpisodeListItem>[]>(
		() => [
			{
				accessorKey: 'season',
				header: 'Season',
				cell: ({ getValue }) => <Tag color="blue">S{getValue<number>()}</Tag>,
			},
			{
				accessorKey: 'episode_number',
				header: 'Episode',
				cell: ({ getValue }) => <Tag color="gray">E{getValue<number>()}</Tag>,
			},
			{
				accessorKey: 'name',
				header: 'Title',
			},
			{
				accessorKey: 'airdate',
				header: 'Air date',
				cell: ({ getValue }) => (
					<Text variant="body">{formatAirdate(getValue<string>())}</Text>
				),
			},
		],
		[],
	)

	const displayEpisode = detail ?? selectedPreview
	const title = displayEpisode?.name ?? 'Episode'
	const synopsisOrDescription =
		detail?.description ?? displayEpisode?.synopsis ?? ''

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
							<>
								<TsTable<EpisodeListItem>
									data={episodes}
									columns={columns}
									columnWidths={['auto', 'auto', 'minmax(12rem, 1fr)', 'auto']}
									options={{
										getRowId: (row) => String(row.id),
									}}
									rowClick={{
										type: 'action',
										onClick: (row) => {
											setSelectedId(row.original.id)
											setSelectedPreview(row.original)
											setDetail(null)
											setDetailError(null)
										},
									}}
								/>
								<Pagination
									page={page}
									total={totalCount}
									size={PAGE_SIZE}
									loading={listLoading}
									onPageChange={(nextPage) => {
										setPage(nextPage)
									}}
								/>
							</>
						)}
					</Stack>
				</PageContent>
			</Page>

			<DrawerPopover>
				<DrawerHeader>
					<DrawerHeading>{title}</DrawerHeading>
					<DrawerDismiss label="Close episode details" />
				</DrawerHeader>
				<DrawerContent>
					<Stack space="$space-4">
						{detailError ? (
							<Alert variant="critical">{detailError}</Alert>
						) : null}
						{detailLoading ? (
							<Spinner size={24} description="Loading details" />
						) : null}
						{displayEpisode ? (
							<>
								<Stack horizontal space="$space-2">
									<Tag color="blue">S{displayEpisode.season}</Tag>
									<Tag color="gray">E{displayEpisode.episode_number}</Tag>
									{displayEpisode.airdate ? (
										<Text as="span" variant="caption1">
											Aired {displayEpisode.airdate}
										</Text>
									) : null}
								</Stack>
								<img
									src={episodeImageUrl(displayEpisode.image_path)}
									alt={`${title} — promotional still`}
									width={640}
									height={360}
									style={{
										width: '100%',
										height: 'auto',
										borderRadius: 'var(--sl-border-radius-2, 8px)',
									}}
								/>
								{synopsisOrDescription ? (
									<Text as="p" variant="body">
										{synopsisOrDescription}
									</Text>
								) : null}
							</>
						) : null}
					</Stack>
				</DrawerContent>
			</DrawerPopover>
		</DrawerProvider>
	)
}
