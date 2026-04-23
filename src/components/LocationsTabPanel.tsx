import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps } from 'react'
import type { LocationListItem } from '../simpsons-api.ts'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'
import { LocationsTable } from './LocationsTable.tsx'

export type LocationsTabPanelProps = {
	pagination: ComponentProps<typeof Pagination>
	locations: LocationListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onLocationSelect: (location: LocationListItem) => void
}

export function LocationsTabPanel({
	pagination,
	locations,
	listError,
	isPending,
	isFetching,
	isError,
	onRefetch,
	onLocationSelect,
}: LocationsTabPanelProps) {
	return (
		<Collection>
			<CollectionRow justify="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>

			<CollectionView
				status={getCollectionViewStatus(
					listError,
					isPending,
					isFetching,
					locations.length,
				)}
				messages={
					listError
						? {
								'error-heading': listError,
								'error-action': 'Try again',
							}
						: !isPending && !isError && locations.length === 0
							? {
									'empty-heading': 'No locations',
									'empty-description': 'There are no locations to show.',
								}
							: undefined
				}
				onError={onRefetch}
			>
				<LocationsTable
					locations={locations}
					onLocationSelect={onLocationSelect}
				/>
			</CollectionView>

			<CollectionRow align="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>
		</Collection>
	)
}
