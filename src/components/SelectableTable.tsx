import type { ColumnDef } from '@tanstack/react-table'
import { TsTable } from '@vtex/shoreline-ts-table'

export type SelectableTableProps<T extends { id: number }> = {
	data: T[]
	columns: ColumnDef<T>[]
	columnWidths?: string[]
	onRowSelect: (row: T) => void
}

export function SelectableTable<T extends { id: number }>({
	data,
	columns,
	columnWidths,
	onRowSelect,
}: SelectableTableProps<T>) {
	return (
		<TsTable<T>
			data={data}
			columns={columns}
			columnWidths={columnWidths}
			stickyHeader
			options={{
				getRowId: (row) => String(row.id),
			}}
			rowClick={{
				type: 'action',
				onClick: (row) => {
					onRowSelect(row.original)
				},
			}}
		/>
	)
}
