import type { ColumnDef } from '@tanstack/react-table'
import { Tag, Text } from '@vtex/shoreline'
import { TsTable } from '@vtex/shoreline-ts-table'
import type { LocationListItem } from '../simpsons-api.ts'

const locationTableColumns: ColumnDef<LocationListItem>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'town',
		header: 'Town',
		cell: ({ getValue }) => <Tag color="blue">{getValue<string>()}</Tag>,
	},
	{
		accessorKey: 'use',
		header: 'Use',
		cell: ({ getValue }) => (
			<Text variant="body">{getValue<string>() || '—'}</Text>
		),
	},
]

export type LocationsTableProps = {
	locations: LocationListItem[]
}

export function LocationsTable({ locations }: LocationsTableProps) {
	return (
		<TsTable<LocationListItem>
			data={locations}
			columns={locationTableColumns}
			columnWidths={['minmax(12rem, 1.5fr)', 'auto', 'minmax(10rem, 1fr)']}
			stickyHeader
			options={{
				getRowId: (row) => String(row.id),
			}}
		/>
	)
}
