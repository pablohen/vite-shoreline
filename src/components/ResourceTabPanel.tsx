import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps, ReactNode } from 'react'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'
import { TableAreaSkeleton } from './TableAreaSkeleton.tsx'

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
	skeletonColumnCount?: number
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
	skeletonColumnCount = 4,
	children,
}: ResourceTabPanelProps<T>) {
	const isEmptyPage = pagination.page > 1 && items.length === 0
	const messages = listError
		? {
				'error-heading': listError,
				'error-action': 'Try again',
			}
		: !isPending && !isError && items.length === 0
			? {
					'empty-heading': isEmptyPage
						? `Nothing on page ${pagination.page}`
						: emptyHeading,
					'empty-description': isEmptyPage
						? 'Try going back to a previous page.'
						: emptyDescription,
				}
			: undefined

	const showTableSkeleton = isFetching && !isPending

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
				{showTableSkeleton ? (
					<TableAreaSkeleton columnCount={skeletonColumnCount} />
				) : (
					children(items)
				)}
			</CollectionView>

			<CollectionRow align="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>
		</Collection>
	)
}
