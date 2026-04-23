import { useQuery } from '@tanstack/react-query'
import {
	Collection,
	CollectionRow,
	CollectionView,
	DrawerProvider,
	Page,
	PageContent,
	PageHeader,
	PageHeaderRow,
	PageHeading,
	Pagination,
	Tab,
	TabList,
	TabPanel,
	TabProvider,
} from '@vtex/shoreline'
import { type ComponentProps, useEffect, useState } from 'react'
import { CharacterDetailsDrawer } from '../components/CharacterDetailsDrawer.tsx'
import { CharactersTable } from '../components/CharactersTable.tsx'
import { EpisodeDetailsDrawer } from '../components/EpisodeDetailsDrawer.tsx'
import { EpisodesTable } from '../components/EpisodesTable.tsx'
import { LocationDetailsDrawer } from '../components/LocationDetailsDrawer.tsx'
import { LocationsTable } from '../components/LocationsTable.tsx'
import {
	type CharacterListItem,
	type EpisodeListItem,
	fetchCharactersPage,
	fetchEpisodesPage,
	fetchLocationsPage,
	type LocationListItem,
	SIMPSONS_PAGE_SIZE,
} from '../simpsons-api.ts'
import { isSimpsonsTabId, type SimpsonsTabId } from '../simpsons-tabs.ts'

export type SimpsonsBrowsePageProps = {
	tab: SimpsonsTabId
	page: number
	onTabChange: (tab: SimpsonsTabId) => void
	onPageChange: (page: number) => void
}

function getCollectionStatus(
	listError: string | null,
	isPending: boolean,
	isFetching: boolean,
	rowCount: number,
): ComponentProps<typeof CollectionView>['status'] {
	if (listError) {
		return 'error'
	}
	if (isPending && rowCount === 0) {
		return 'loading'
	}
	if (!isPending && !isFetching && !listError && rowCount === 0) {
		return 'empty'
	}
	return 'ready'
}

type BrowseDrawerState =
	| null
	| { kind: 'episode'; id: number; preview: EpisodeListItem }
	| { kind: 'character'; id: number; preview: CharacterListItem }
	| { kind: 'location'; id: number; preview: LocationListItem }

export function SimpsonsBrowsePage({
	tab,
	page,
	onTabChange,
	onPageChange,
}: SimpsonsBrowsePageProps) {
	const episodesQuery = useQuery({
		queryKey: ['episodes', 'list', page] as const,
		queryFn: () => fetchEpisodesPage(page),
		enabled: tab === 'episodes',
	})

	const charactersQuery = useQuery({
		queryKey: ['characters', 'list', page] as const,
		queryFn: () => fetchCharactersPage(page),
		enabled: tab === 'characters',
	})

	const locationsQuery = useQuery({
		queryKey: ['locations', 'list', page] as const,
		queryFn: () => fetchLocationsPage(page),
		enabled: tab === 'locations',
	})

	const [drawer, setDrawer] = useState<BrowseDrawerState>(null)

	const drawerOpen = drawer !== null

	// Close drawer when the route tab changes (e.g. URL / back-forward).
	// biome-ignore lint/correctness/useExhaustiveDependencies: tab is the intentional trigger
	useEffect(() => {
		setDrawer(null)
	}, [tab])

	function handleDrawerOpenChange(open: boolean) {
		if (!open) {
			setDrawer(null)
		}
	}

	const episodes = episodesQuery.data?.results ?? []
	const episodesTotal = episodesQuery.data?.count ?? 0
	const episodesError = episodesQuery.isError
		? episodesQuery.error instanceof Error
			? episodesQuery.error.message
			: 'Failed to load episodes'
		: null

	const characters = charactersQuery.data?.results ?? []
	const charactersTotal = charactersQuery.data?.count ?? 0
	const charactersError = charactersQuery.isError
		? charactersQuery.error instanceof Error
			? charactersQuery.error.message
			: 'Failed to load characters'
		: null

	const locations = locationsQuery.data?.results ?? []
	const locationsTotal = locationsQuery.data?.count ?? 0
	const locationsError = locationsQuery.isError
		? locationsQuery.error instanceof Error
			? locationsQuery.error.message
			: 'Failed to load locations'
		: null

	const episodesPaginationProps: ComponentProps<typeof Pagination> = {
		page,
		total: episodesTotal,
		size: SIMPSONS_PAGE_SIZE,
		loading: episodesQuery.isFetching,
		onPageChange,
	}

	const charactersPaginationProps: ComponentProps<typeof Pagination> = {
		page,
		total: charactersTotal,
		size: SIMPSONS_PAGE_SIZE,
		loading: charactersQuery.isFetching,
		onPageChange,
	}

	const locationsPaginationProps: ComponentProps<typeof Pagination> = {
		page,
		total: locationsTotal,
		size: SIMPSONS_PAGE_SIZE,
		loading: locationsQuery.isFetching,
		onPageChange,
	}

	return (
		<Page>
			<TabProvider
				selectedId={tab}
				setSelectedId={(id) => {
					if (isSimpsonsTabId(id)) {
						onTabChange(id)
					}
				}}
			>
				<PageHeader>
					<PageHeaderRow>
						<PageHeading>The Simpsons</PageHeading>
					</PageHeaderRow>
					<PageHeaderRow>
						<TabList>
							<Tab id="episodes">Episodes</Tab>
							<Tab id="characters">Characters</Tab>
							<Tab id="locations">Locations</Tab>
						</TabList>
					</PageHeaderRow>
				</PageHeader>

				<PageContent layout="standard">
					<TabPanel tabId="episodes">
						<Collection>
							<CollectionRow justify="flex-end">
								<Pagination {...episodesPaginationProps} />
							</CollectionRow>

							<CollectionView
								status={getCollectionStatus(
									episodesError,
									episodesQuery.isPending,
									episodesQuery.isFetching,
									episodes.length,
								)}
								messages={
									episodesError
										? {
												'error-heading': episodesError,
												'error-action': 'Try again',
											}
										: !episodesQuery.isPending &&
												!episodesQuery.isError &&
												episodes.length === 0
											? {
													'empty-heading': 'No episodes',
													'empty-description': 'There are no episodes to show.',
												}
											: undefined
								}
								onError={episodesQuery.refetch}
							>
								<EpisodesTable
									episodes={episodes}
									onEpisodeSelect={(episode) => {
										setDrawer({
											kind: 'episode',
											id: episode.id,
											preview: episode,
										})
									}}
								/>
							</CollectionView>

							<CollectionRow align="flex-end">
								<Pagination {...episodesPaginationProps} />
							</CollectionRow>
						</Collection>
					</TabPanel>

					<TabPanel tabId="characters">
						<Collection>
							<CollectionRow justify="flex-end">
								<Pagination {...charactersPaginationProps} />
							</CollectionRow>

							<CollectionView
								status={getCollectionStatus(
									charactersError,
									charactersQuery.isPending,
									charactersQuery.isFetching,
									characters.length,
								)}
								messages={
									charactersError
										? {
												'error-heading': charactersError,
												'error-action': 'Try again',
											}
										: !charactersQuery.isPending &&
												!charactersQuery.isError &&
												characters.length === 0
											? {
													'empty-heading': 'No characters',
													'empty-description':
														'There are no characters to show.',
												}
											: undefined
								}
								onError={charactersQuery.refetch}
							>
								<CharactersTable
									characters={characters}
									onCharacterSelect={(character) => {
										setDrawer({
											kind: 'character',
											id: character.id,
											preview: character,
										})
									}}
								/>
							</CollectionView>

							<CollectionRow align="flex-end">
								<Pagination {...charactersPaginationProps} />
							</CollectionRow>
						</Collection>
					</TabPanel>

					<TabPanel tabId="locations">
						<Collection>
							<CollectionRow justify="flex-end">
								<Pagination {...locationsPaginationProps} />
							</CollectionRow>

							<CollectionView
								status={getCollectionStatus(
									locationsError,
									locationsQuery.isPending,
									locationsQuery.isFetching,
									locations.length,
								)}
								messages={
									locationsError
										? {
												'error-heading': locationsError,
												'error-action': 'Try again',
											}
										: !locationsQuery.isPending &&
												!locationsQuery.isError &&
												locations.length === 0
											? {
													'empty-heading': 'No locations',
													'empty-description':
														'There are no locations to show.',
												}
											: undefined
								}
								onError={locationsQuery.refetch}
							>
								<LocationsTable
									locations={locations}
									onLocationSelect={(location) => {
										setDrawer({
											kind: 'location',
											id: location.id,
											preview: location,
										})
									}}
								/>
							</CollectionView>

							<CollectionRow align="flex-end">
								<Pagination {...locationsPaginationProps} />
							</CollectionRow>
						</Collection>
					</TabPanel>
				</PageContent>
			</TabProvider>

			<DrawerProvider open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
				{drawer?.kind === 'episode' && (
					<EpisodeDetailsDrawer
						episodeId={drawer.id}
						preview={drawer.preview}
					/>
				)}

				{drawer?.kind === 'character' && (
					<CharacterDetailsDrawer
						characterId={drawer.id}
						preview={drawer.preview}
					/>
				)}

				{drawer?.kind === 'location' && (
					<LocationDetailsDrawer
						locationId={drawer.id}
						preview={drawer.preview}
					/>
				)}
			</DrawerProvider>
		</Page>
	)
}
