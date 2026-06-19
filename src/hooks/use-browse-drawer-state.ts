import { useEffect, useState } from 'react'
import type {
	CharacterListItem,
	EpisodeListItem,
	LocationListItem,
} from '../simpsons-api.ts'
import type { SimpsonsTabId } from '../simpsons-tabs.ts'
import type { BrowseListResults } from './use-simpsons-browse-queries.ts'

export type BrowseDrawerState =
	| null
	| { kind: 'episode'; id: number; preview: EpisodeListItem | null }
	| { kind: 'character'; id: number; preview: CharacterListItem | null }
	| { kind: 'location'; id: number; preview: LocationListItem | null }

export function useBrowseDrawerState(
	detail: number | undefined,
	tab: SimpsonsTabId,
	listResults: BrowseListResults,
): BrowseDrawerState {
	const [drawer, setDrawer] = useState<BrowseDrawerState>(null)

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

	return drawer
}
