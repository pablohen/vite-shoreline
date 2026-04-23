import { useQuery } from '@tanstack/react-query'
import {
	DrawerProvider,
	Page,
	PageContent,
	PageHeader,
	PageHeaderRow,
	PageHeading,
	Tab,
	TabList,
	TabPanel,
	TabProvider,
} from '@vtex/shoreline'
import { useEffect, useState } from 'react'
import { CharacterDetailsDrawer } from '../components/CharacterDetailsDrawer.tsx'
import { CharactersTabPanel } from '../components/CharactersTabPanel.tsx'
import { EpisodeDetailsDrawer } from '../components/EpisodeDetailsDrawer.tsx'
import { EpisodesTabPanel } from '../components/EpisodesTabPanel.tsx'
import { LocationDetailsDrawer } from '../components/LocationDetailsDrawer.tsx'
import { LocationsTabPanel } from '../components/LocationsTabPanel.tsx'
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
import { getErrorMessage } from '../utils/get-error-message.ts'

export type SimpsonsBrowsePageProps = {
	tab: SimpsonsTabId
	page: number
	onTabChange: (tab: SimpsonsTabId) => void
	onPageChange: (page: number) => void
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

	function handleTabChange(tab: SimpsonsTabId) {
		if (isSimpsonsTabId(tab)) {
			onTabChange(tab)
		}
	}

	function handleDrawerOpenChange(open: boolean) {
		if (!open) {
			setDrawer(null)
		}
	}

	// Close drawer when the route tab changes (e.g. URL / back-forward).
	// biome-ignore lint/correctness/useExhaustiveDependencies: tab is the intentional trigger
	useEffect(() => {
		setDrawer(null)
	}, [tab])

	return (
		<Page>
			<TabProvider selectedId={tab} setSelectedId={handleTabChange}>
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
						<EpisodesTabPanel
							episodes={episodesQuery.data?.results ?? []}
							isPending={episodesQuery.isPending}
							isFetching={episodesQuery.isFetching}
							isError={episodesQuery.isError}
							onRefetch={episodesQuery.refetch}
							onEpisodeSelect={(episode: EpisodeListItem) => {
								setDrawer({
									kind: 'episode',
									id: episode.id,
									preview: episode,
								})
							}}
							listError={getErrorMessage(
								episodesQuery.isError,
								episodesQuery.error,
								'Failed to load episodes',
							)}
							pagination={{
								page,
								total: episodesQuery.data?.count ?? 0,
								size: SIMPSONS_PAGE_SIZE,
								loading: episodesQuery.isFetching,
								onPageChange,
							}}
						/>
					</TabPanel>

					<TabPanel tabId="characters">
						<CharactersTabPanel
							characters={charactersQuery.data?.results ?? []}
							isPending={charactersQuery.isPending}
							isFetching={charactersQuery.isFetching}
							isError={charactersQuery.isError}
							onRefetch={charactersQuery.refetch}
							onCharacterSelect={(character: CharacterListItem) => {
								setDrawer({
									kind: 'character',
									id: character.id,
									preview: character,
								})
							}}
							listError={getErrorMessage(
								charactersQuery.isError,
								charactersQuery.error,
								'Failed to load characters',
							)}
							pagination={{
								page,
								total: charactersQuery.data?.count ?? 0,
								size: SIMPSONS_PAGE_SIZE,
								loading: charactersQuery.isFetching,
								onPageChange,
							}}
						/>
					</TabPanel>

					<TabPanel tabId="locations">
						<LocationsTabPanel
							locations={locationsQuery.data?.results ?? []}
							isPending={locationsQuery.isPending}
							isFetching={locationsQuery.isFetching}
							isError={locationsQuery.isError}
							onRefetch={locationsQuery.refetch}
							onLocationSelect={(location: LocationListItem) => {
								setDrawer({
									kind: 'location',
									id: location.id,
									preview: location,
								})
							}}
							listError={getErrorMessage(
								locationsQuery.isError,
								locationsQuery.error,
								'Failed to load locations',
							)}
							pagination={{
								page,
								total: locationsQuery.data?.count ?? 0,
								size: SIMPSONS_PAGE_SIZE,
								loading: locationsQuery.isFetching,
								onPageChange,
							}}
						/>
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
