import type { ColumnDef } from '@tanstack/react-table'
import { Tag, Text } from '@vtex/shoreline'
import { TsTable } from '@vtex/shoreline-ts-table'
import type { ComponentProps } from 'react'
import type { CharacterListItem } from '../simpsons-api.ts'

function statusColor(status: string): ComponentProps<typeof Tag>['color'] {
	const normalized = status.toLowerCase()
	if (normalized === 'alive') {
		return 'green'
	}
	if (normalized === 'deceased') {
		return 'red'
	}
	return 'gray'
}

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
				<Tag variant="secondary" color={statusColor(status)}>
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
		<TsTable<CharacterListItem>
			data={characters}
			columns={characterTableColumns}
			columnWidths={[
				'minmax(10rem, 1fr)',
				'minmax(12rem, 1.5fr)',
				'auto',
				'auto',
			]}
			stickyHeader
			options={{
				getRowId: (row) => String(row.id),
			}}
			rowClick={{
				type: 'action',
				onClick: (row) => {
					onCharacterSelect(row.original)
				},
			}}
		/>
	)
}
