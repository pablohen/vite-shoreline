import type { ColumnDef } from '@tanstack/react-table'
import { Tag, Text } from '@vtex/shoreline'
import type { CharacterListItem } from '../simpsons-api.ts'
import { characterStatusColor } from '../utils/character-status-color.ts'
import { SelectableTable } from './SelectableTable.tsx'

const characterTableColumns: ColumnDef<CharacterListItem>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'occupation',
		header: 'Occupation',
		cell: ({ getValue }) => (
			<Text variant="body">{getValue<string>() || '—'}</Text>
		),
	},
	{
		accessorKey: 'gender',
		header: 'Gender',
		cell: ({ getValue }) => <Tag color="blue">{getValue<string>()}</Tag>,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ getValue }) => {
			const status = getValue<string>()
			return (
				<Tag variant="secondary" color={characterStatusColor(status)}>
					{status}
				</Tag>
			)
		},
	},
]

export type CharactersTableProps = {
	characters: CharacterListItem[]
	onCharacterSelect: (character: CharacterListItem) => void
}

export function CharactersTable({
	characters,
	onCharacterSelect,
}: CharactersTableProps) {
	return (
		<SelectableTable
			data={characters}
			columns={characterTableColumns}
			columnWidths={[
				'minmax(10rem, 1fr)',
				'minmax(12rem, 1.5fr)',
				'auto',
				'auto',
			]}
			onRowSelect={onCharacterSelect}
		/>
	)
}
