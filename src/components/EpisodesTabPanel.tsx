import type { ComponentProps } from 'react'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { EpisodesTable } from './EpisodesTable.tsx'
import { ResourceTabPanel } from './ResourceTabPanel.tsx'

export type EpisodesTabPanelProps = {
	pagination: ComponentProps<typeof ResourceTabPanel>['pagination']
	episodes: EpisodeListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onEpisodeSelect: (episode: EpisodeListItem) => void
}

export function EpisodesTabPanel({
	episodes,
	onEpisodeSelect,
	...queryState
}: EpisodesTabPanelProps) {
	return (
		<ResourceTabPanel
			items={episodes}
			emptyHeading="No episodes"
			emptyDescription="There are no episodes to show."
			{...queryState}
		>
			{(items) => (
				<EpisodesTable episodes={items} onEpisodeSelect={onEpisodeSelect} />
			)}
		</ResourceTabPanel>
	)
}
