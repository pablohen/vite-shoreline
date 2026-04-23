import type { CollectionView } from '@vtex/shoreline'
import type { ComponentProps } from 'react'

export function getCollectionViewStatus(
	listError: string | null,
	isPending: boolean,
	isFetching: boolean,
	rowCount: number,
): ComponentProps<typeof CollectionView>['status'] {
	if (listError) {
		return 'error'
	}
	if (isPending && rowCount === 0) {
		return 'loading'
	}
	if (!isPending && !isFetching && !listError && rowCount === 0) {
		return 'empty'
	}
	return 'ready'
}
