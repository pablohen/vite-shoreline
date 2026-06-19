import type { ColumnDef } from '@tanstack/react-table'
import type { LocationListItem } from '../simpsons-api.ts'
import { blueTag, textOrDash } from '../utils/table-cells.tsx'
import { SelectableTable } from './SelectableTable.tsx'

const locationTableColumns: ColumnDef<LocationListItem>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'town',
		header: 'Town',
		cell: ({ getValue }) => blueTag(getValue<string>()),
	},
	{
		accessorKey: 'use',
		header: 'Use',
		cell: ({ getValue }) => textOrDash(getValue<string>()),
	},
]

export type LocationsTableProps = {
	locations: LocationListItem[]
	onLocationSelect: (location: LocationListItem) => void
}

export function LocationsTable({
	locations,
	onLocationSelect,
}: LocationsTableProps) {
	return (
		<SelectableTable
			data={locations}
			columns={locationTableColumns}
			columnWidths={['minmax(12rem, 1.5fr)', 'auto', 'minmax(10rem, 1fr)']}
			onRowSelect={onLocationSelect}
		/>
	)
}
