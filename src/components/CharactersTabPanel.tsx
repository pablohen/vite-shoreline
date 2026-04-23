import {
	Collection,
	CollectionRow,
	CollectionView,
	Pagination,
} from '@vtex/shoreline'
import type { ComponentProps } from 'react'
import type { CharacterListItem } from '../simpsons-api.ts'
import { getCollectionViewStatus } from '../utils/collection-view-status.ts'
import { CharactersTable } from './CharactersTable.tsx'

export type CharactersTabPanelProps = {
	pagination: ComponentProps<typeof Pagination>
	characters: CharacterListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onCharacterSelect: (character: CharacterListItem) => void
}

export function CharactersTabPanel({
	pagination,
	characters,
	listError,
	isPending,
	isFetching,
	isError,
	onRefetch,
	onCharacterSelect,
}: CharactersTabPanelProps) {
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
					characters.length,
				)}
				messages={
					listError
						? {
								'error-heading': listError,
								'error-action': 'Try again',
							}
						: !isPending && !isError && characters.length === 0
							? {
									'empty-heading': 'No characters',
									'empty-description': 'There are no characters to show.',
								}
							: undefined
				}
				onError={onRefetch}
			>
				<CharactersTable
					characters={characters}
					onCharacterSelect={onCharacterSelect}
				/>
			</CollectionView>

			<CollectionRow align="flex-end">
				<Pagination {...pagination} />
			</CollectionRow>
		</Collection>
	)
}
