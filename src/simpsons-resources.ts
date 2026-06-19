import type { SimpsonsTabId } from './simpsons-tabs.ts'

export type ResourceUiConfig = {
	label: string
	errorLabel: string
	emptyHeading: string
	emptyDescription: string
	skeletonColumnCount: number
}

export const SIMPSONS_RESOURCE_CONFIG = {
	episodes: {
		label: 'Episodes',
		errorLabel: 'Failed to load episodes',
		emptyHeading: 'No episodes',
		emptyDescription: 'There are no episodes to show.',
		skeletonColumnCount: 4,
	},
	characters: {
		label: 'Characters',
		errorLabel: 'Failed to load characters',
		emptyHeading: 'No characters',
		emptyDescription: 'There are no characters to show.',
		skeletonColumnCount: 4,
	},
	locations: {
		label: 'Locations',
		errorLabel: 'Failed to load locations',
		emptyHeading: 'No locations',
		emptyDescription: 'There are no locations to show.',
		skeletonColumnCount: 3,
	},
} as const satisfies Record<SimpsonsTabId, ResourceUiConfig>
