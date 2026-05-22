import type { ComponentProps } from 'react'
import type { CharacterListItem } from '../simpsons-api.ts'
import { CharactersTable } from './CharactersTable.tsx'
import { ResourceTabPanel } from './ResourceTabPanel.tsx'

export type CharactersTabPanelProps = {
	pagination: ComponentProps<typeof ResourceTabPanel>['pagination']
	characters: CharacterListItem[]
	listError: string | null
	isPending: boolean
	isFetching: boolean
	isError: boolean
	onRefetch: () => void
	onCharacterSelect: (character: CharacterListItem) => void
}

export function CharactersTabPanel({
	characters,
	onCharacterSelect,
	...queryState
}: CharactersTabPanelProps) {
	return (
		<ResourceTabPanel
			items={characters}
			emptyHeading="No characters"
			emptyDescription="There are no characters to show."
			{...queryState}
		>
			{(items) => (
				<CharactersTable
					characters={items}
					onCharacterSelect={onCharacterSelect}
				/>
			)}
		</ResourceTabPanel>
	)
}
