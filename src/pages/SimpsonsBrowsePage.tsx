import type { UseQueryResult } from '@tanstack/react-query'
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
import { useEffect, useMemo, useState } from 'react'
import { CharacterDetailsDrawer } from '../components/CharacterDetailsDrawer.tsx'
import { CharactersTabPanel } from '../components/CharactersTabPanel.tsx'
import { EpisodeDetailsDrawer } from '../components/EpisodeDetailsDrawer.tsx'
import { EpisodesTabPanel } from '../components/EpisodesTabPanel.tsx'
import { LocationDetailsDrawer } from '../components/LocationDetailsDrawer.tsx'
import { LocationsTabPanel } from '../components/LocationsTabPanel.tsx'
import {
	getListPagination,
	useSimpsonsListQuery,
} from '../hooks/use-simpsons-list-query.ts'
import type {
	CharacterListItem,
	CharactersListResponse,
	EpisodeListItem,
	EpisodesListResponse,
	LocationListItem,
	LocationsListResponse,
} from '../simpsons-api.ts'
import {
	isSimpsonsTabId,
	SIMPSONS_TAB_IDS,
	type SimpsonsTabId,
} from '../simpsons-tabs.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'

export type SimpsonsBrowsePageProps = {
	tab: SimpsonsTabId
	page: number
	detail: number | undefined
	onTabChange: (tab: SimpsonsTabId) => void
	onPageChange: (page: number) => void
	onDetailChange: (detail: number | undefined) => void
}

type BrowseDrawerState =
	| null
	| { kind: 'episode'; id: number; preview: EpisodeListItem | null }
	| { kind: 'character'; id: number; preview: CharacterListItem | null }
	| { kind: 'location'; id: number; preview: LocationListItem | null }

const RESOURCE_CONFIG = {
	episodes: {
		label: 'Episodes',
		errorLabel: 'Failed to load episodes',
	},
	characters: {
		label: 'Characters',
		errorLabel: 'Failed to load characters',
	},
	locations: {
		label: 'Locations',
		errorLabel: 'Failed to load locations',
	},
} as const

function getTabPanelQueryState(
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

export function SimpsonsBrowsePage({
	tab,
	page,
	detail,
	onTabChange,
	onPageChange,
	onDetailChange,
}: SimpsonsBrowsePageProps) {
	const episodesQuery = useSimpsonsListQuery(
		'episodes',
		page,
		tab === 'episodes',
	)
	const charactersQuery = useSimpsonsListQuery(
		'characters',
		page,
		tab === 'characters',
	)
	const locationsQuery = useSimpsonsListQuery(
		'locations',
		page,
		tab === 'locations',
	)

	const [drawer, setDrawer] = useState<BrowseDrawerState>(null)

	const listResults = useMemo(
		() => ({
			episodes: episodesQuery.data?.results ?? [],
			characters: charactersQuery.data?.results ?? [],
			locations: locationsQuery.data?.results ?? [],
		}),
		[
			episodesQuery.data?.results,
			charactersQuery.data?.results,
			locationsQuery.data?.results,
		],
	)

	useEffect(() => {
		if (detail == null) {
			setDrawer(null)
			return
		}

		switch (tab) {
			case 'episodes':
				setDrawer({
					kind: 'episode',
					id: detail,
					preview:
						listResults.episodes.find((item) => item.id === detail) ?? null,
				})
				break
			case 'characters':
				setDrawer({
					kind: 'character',
					id: detail,
					preview:
						listResults.characters.find((item) => item.id === detail) ?? null,
				})
				break
			case 'locations':
				setDrawer({
					kind: 'location',
					id: detail,
					preview:
						listResults.locations.find((item) => item.id === detail) ?? null,
				})
				break
		}
	}, [detail, tab, listResults])

	function handleTabChange(selectedId: string | null | undefined) {
		if (isSimpsonsTabId(selectedId)) {
			onTabChange(selectedId)
		}
	}

	function handleDrawerOpenChange(open: boolean) {
		if (!open) {
			onDetailChange(undefined)
		}
	}

	function handleItemSelect(
		item: EpisodeListItem | CharacterListItem | LocationListItem,
	) {
		onDetailChange(item.id)
	}

	return (
		<Page>
			<TabProvider selectedId={tab} setSelectedId={handleTabChange}>
				<PageHeader>
					<PageHeaderRow>
						<PageHeading>The Simpsons</PageHeading>
					</PageHeaderRow>
					<PageHeaderRow>
						<TabList>
							{SIMPSONS_TAB_IDS.map((tabId) => (
								<Tab key={tabId} id={tabId}>
									{RESOURCE_CONFIG[tabId].label}
								</Tab>
							))}
						</TabList>
					</PageHeaderRow>
				</PageHeader>

				<PageContent layout="standard">
					<TabPanel tabId="episodes">
						<EpisodesTabPanel
							episodes={episodesQuery.data?.results ?? []}
							onEpisodeSelect={handleItemSelect}
							{...getTabPanelQueryState(
								episodesQuery,
								RESOURCE_CONFIG.episodes.errorLabel,
								page,
								onPageChange,
							)}
						/>
					</TabPanel>

					<TabPanel tabId="characters">
						<CharactersTabPanel
							characters={charactersQuery.data?.results ?? []}
							onCharacterSelect={handleItemSelect}
							{...getTabPanelQueryState(
								charactersQuery,
								RESOURCE_CONFIG.characters.errorLabel,
								page,
								onPageChange,
							)}
						/>
					</TabPanel>

					<TabPanel tabId="locations">
						<LocationsTabPanel
							locations={locationsQuery.data?.results ?? []}
							onLocationSelect={handleItemSelect}
							{...getTabPanelQueryState(
								locationsQuery,
								RESOURCE_CONFIG.locations.errorLabel,
								page,
								onPageChange,
							)}
						/>
					</TabPanel>
				</PageContent>
			</TabProvider>

			<DrawerProvider
				open={drawer !== null}
				onOpenChange={handleDrawerOpenChange}
			>
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
