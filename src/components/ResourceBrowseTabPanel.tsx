import type { ComponentProps } from 'react'
import type {
	CharacterListItem,
	EpisodeListItem,
	LocationListItem,
} from '../simpsons-api.ts'
import { SIMPSONS_RESOURCE_CONFIG } from '../simpsons-resources.ts'
import type { SimpsonsTabId } from '../simpsons-tabs.ts'
import { CharactersTable } from './CharactersTable.tsx'
import { EpisodesTable } from './EpisodesTable.tsx'
import { LocationsTable } from './LocationsTable.tsx'
import { ResourceTabPanel } from './ResourceTabPanel.tsx'

type ResourceTabPanelQueryState = Omit<
	ComponentProps<typeof ResourceTabPanel>,
	| 'items'
	| 'children'
	| 'emptyHeading'
	| 'emptyDescription'
	| 'skeletonColumnCount'
>

export type ResourceBrowseTabPanelProps = ResourceTabPanelQueryState & {
	tabId: SimpsonsTabId
	items: EpisodeListItem[] | CharacterListItem[] | LocationListItem[]
	onItemSelect: (
		item: EpisodeListItem | CharacterListItem | LocationListItem,
	) => void
}

export function ResourceBrowseTabPanel({
	tabId,
	items,
	onItemSelect,
	...queryState
}: ResourceBrowseTabPanelProps) {
	const config = SIMPSONS_RESOURCE_CONFIG[tabId]

	switch (tabId) {
		case 'episodes':
			return (
				<ResourceTabPanel
					items={items as EpisodeListItem[]}
					emptyHeading={config.emptyHeading}
					emptyDescription={config.emptyDescription}
					skeletonColumnCount={config.skeletonColumnCount}
					{...queryState}
				>
					{(panelItems) => (
						<EpisodesTable
							episodes={panelItems}
							onEpisodeSelect={onItemSelect}
						/>
					)}
				</ResourceTabPanel>
			)
		case 'characters':
			return (
				<ResourceTabPanel
					items={items as CharacterListItem[]}
					emptyHeading={config.emptyHeading}
					emptyDescription={config.emptyDescription}
					skeletonColumnCount={config.skeletonColumnCount}
					{...queryState}
				>
					{(panelItems) => (
						<CharactersTable
							characters={panelItems}
							onCharacterSelect={onItemSelect}
						/>
					)}
				</ResourceTabPanel>
			)
		case 'locations':
			return (
				<ResourceTabPanel
					items={items as LocationListItem[]}
					emptyHeading={config.emptyHeading}
					emptyDescription={config.emptyDescription}
					skeletonColumnCount={config.skeletonColumnCount}
					{...queryState}
				>
					{(panelItems) => (
						<LocationsTable
							locations={panelItems}
							onLocationSelect={onItemSelect}
						/>
					)}
				</ResourceTabPanel>
			)
	}
}
