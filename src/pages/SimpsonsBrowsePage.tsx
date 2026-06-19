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
import { BrowseDetailDrawer } from '../components/BrowseDetailDrawer.tsx'
import { ResourceBrowseTabPanel } from '../components/ResourceBrowseTabPanel.tsx'
import {
	SimpsonsBottomNav,
	simpsonsPanelId,
} from '../components/SimpsonsBottomNav.tsx'
import { useBrowseDrawerState } from '../hooks/use-browse-drawer-state.ts'
import { useIsMobileNav } from '../hooks/use-media-query.ts'
import {
	getTabPanelQueryState,
	useSimpsonsBrowseQueries,
} from '../hooks/use-simpsons-browse-queries.ts'
import type {
	CharacterListItem,
	EpisodeListItem,
	LocationListItem,
} from '../simpsons-api.ts'
import { SIMPSONS_RESOURCE_CONFIG } from '../simpsons-resources.ts'
import {
	isSimpsonsTabId,
	SIMPSONS_TAB_IDS,
	type SimpsonsTabId,
} from '../simpsons-tabs.ts'

export type SimpsonsBrowsePageProps = {
	tab: SimpsonsTabId
	page: number
	detail: number | undefined
	onTabChange: (tab: SimpsonsTabId) => void
	onPageChange: (page: number) => void
	onDetailChange: (detail: number | undefined) => void
	onNavigateToResourceDetail: (tab: SimpsonsTabId, detailId: number) => void
}

export function SimpsonsBrowsePage({
	tab,
	page,
	detail,
	onTabChange,
	onPageChange,
	onDetailChange,
	onNavigateToResourceDetail,
}: SimpsonsBrowsePageProps) {
	const isMobileNav = useIsMobileNav()
	const { queries, listResults } = useSimpsonsBrowseQueries(tab, page)
	const drawer = useBrowseDrawerState(detail, tab, listResults)

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
		<TabProvider selectedId={tab} setSelectedId={handleTabChange}>
			<Page
				style={
					isMobileNav
						? {
								minHeight: '100dvh',
								gridTemplateRows: 'auto 1fr auto',
							}
						: undefined
				}
			>
				<PageHeader>
					<PageHeaderRow>
						<PageHeading>The Simpsons</PageHeading>
					</PageHeaderRow>
					<PageHeaderRow
						style={
							isMobileNav
								? {
										position: 'absolute',
										width: 1,
										height: 1,
										overflow: 'hidden',
										clipPath: 'inset(50%)',
									}
								: undefined
						}
					>
						<TabList>
							{SIMPSONS_TAB_IDS.map((tabId) => (
								<Tab key={tabId} id={tabId}>
									{SIMPSONS_RESOURCE_CONFIG[tabId].label}
								</Tab>
							))}
						</TabList>
					</PageHeaderRow>
				</PageHeader>

				<PageContent
					layout="standard"
					style={
						isMobileNav
							? {
									minHeight: 0,
									overflowY: 'auto',
								}
							: undefined
					}
				>
					{SIMPSONS_TAB_IDS.map((tabId) => (
						<TabPanel key={tabId} id={simpsonsPanelId(tabId)} tabId={tabId}>
							<ResourceBrowseTabPanel
								tabId={tabId}
								items={listResults[tabId]}
								onItemSelect={handleItemSelect}
								{...getTabPanelQueryState(
									queries[tabId],
									SIMPSONS_RESOURCE_CONFIG[tabId].errorLabel,
									page,
									onPageChange,
								)}
							/>
						</TabPanel>
					))}
				</PageContent>

				{isMobileNav ? (
					<SimpsonsBottomNav tab={tab} onTabChange={onTabChange} />
				) : null}
			</Page>

			<DrawerProvider
				open={drawer !== null}
				onOpenChange={handleDrawerOpenChange}
			>
				<BrowseDetailDrawer
					drawer={drawer}
					onNavigateToEpisode={(episodeId) => {
						onNavigateToResourceDetail('episodes', episodeId)
					}}
				/>
			</DrawerProvider>
		</TabProvider>
	)
}
