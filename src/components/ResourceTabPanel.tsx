import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps, ReactNode } from 'react'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'

export type ResourceTabPanelProps<T> = {
	items: T[]
	pagination: ComponentProps<typeof Pagination>
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	emptyHeading: string
	emptyDescription: string
	children: (items: T[]) => ReactNode
}

export function ResourceTabPanel<T>({
	items,
	pagination,
	listError,
	isPending,
	isFetching,
	isError,
	onRefetch,
	emptyHeading,
	emptyDescription,
	children,
}: ResourceTabPanelProps<T>) {
	const messages = listError
		? {
				'error-heading': listError,
				'error-action': 'Try again',
			}
		: !isPending && !isError && items.length === 0
			? {
					'empty-heading': emptyHeading,
					'empty-description': emptyDescription,
				}
			: undefined

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
					items.length,
				)}
				messages={messages}
				onError={onRefetch}
			>
				{children(items)}
			</CollectionView>

			<CollectionRow align="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>
		</Collection>
	)
}
