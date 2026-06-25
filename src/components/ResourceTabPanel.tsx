import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps, ReactNode } from 'react'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'
import { TableAreaSkeleton } from './TableAreaSkeleton.tsx'

export type ResourceTabPanelMessages =
	| {
			'error-heading': string
			'error-action': string
	  }
	| {
			'empty-heading': string
			'empty-description': string
	  }
	| undefined

export function getResourceTabPanelMessages(
	listError: string | null,
	isPending: boolean,
	isError: boolean,
	itemsLength: number,
	paginationPage: number,
	emptyHeading: string,
	emptyDescription: string,
): ResourceTabPanelMessages {
	const isEmptyPage = paginationPage > 1 && itemsLength === 0

	if (listError) {
		return {
			'error-heading': listError,
			'error-action': 'Try again',
		}
	}

	if (!isPending && !isError && itemsLength === 0) {
		return {
			'empty-heading': isEmptyPage
				? `Nothing on page ${paginationPage}`
				: emptyHeading,
			'empty-description': isEmptyPage
				? 'Try going back to a previous page.'
				: emptyDescription,
		}
	}

	return undefined
}

export function shouldShowTableSkeleton(
	isFetching: boolean,
	isPending: boolean,
): boolean {
	return isFetching && !isPending
}

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
	const messages = getResourceTabPanelMessages(
		listError,
		isPending,
		isError,
		items.length,
		pagination.page,
		emptyHeading,
		emptyDescription,
	)
	const showTableSkeleton = shouldShowTableSkeleton(isFetching, isPending)

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
