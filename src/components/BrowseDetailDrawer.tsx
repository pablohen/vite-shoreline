import type { BrowseDrawerState } from '../hooks/use-browse-drawer-state.ts'
import { CharacterDetailsDrawer } from './CharacterDetailsDrawer.tsx'
import { EpisodeDetailsDrawer } from './EpisodeDetailsDrawer.tsx'
import { LocationDetailsDrawer } from './LocationDetailsDrawer.tsx'

export type BrowseDetailDrawerProps = {
	drawer: BrowseDrawerState
	onNavigateToEpisode: (episodeId: number) => void
}

export function BrowseDetailDrawer({
	drawer,
	onNavigateToEpisode,
}: BrowseDetailDrawerProps) {
	if (drawer == null) {
		return null
	}

	switch (drawer.kind) {
		case 'episode':
			return (
				<EpisodeDetailsDrawer episodeId={drawer.id} preview={drawer.preview} />
			)
		case 'character':
			return (
				<CharacterDetailsDrawer
					characterId={drawer.id}
					preview={drawer.preview}
					onNavigateToEpisode={onNavigateToEpisode}
				/>
			)
		case 'location':
			return (
				<LocationDetailsDrawer
					locationId={drawer.id}
					preview={drawer.preview}
					onNavigateToEpisode={onNavigateToEpisode}
				/>
			)
	}
}
