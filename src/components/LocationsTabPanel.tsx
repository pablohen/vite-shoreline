import type { ComponentProps } from 'react'
import type { LocationListItem } from '../simpsons-api.ts'
import { LocationsTable } from './LocationsTable.tsx'
import { ResourceTabPanel } from './ResourceTabPanel.tsx'

export type LocationsTabPanelProps = {
	pagination: ComponentProps<typeof ResourceTabPanel>['pagination']
	locations: LocationListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onLocationSelect: (location: LocationListItem) => void
}

export function LocationsTabPanel({
	locations,
	onLocationSelect,
	...queryState
}: LocationsTabPanelProps) {
	return (
		<ResourceTabPanel
			items={locations}
			emptyHeading="No locations"
			emptyDescription="There are no locations to show."
			{...queryState}
		>
			{(items) => (
				<LocationsTable locations={items} onLocationSelect={onLocationSelect} />
			)}
		</ResourceTabPanel>
	)
}
