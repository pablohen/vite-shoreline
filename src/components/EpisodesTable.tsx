import type { ColumnDef } from '@tanstack/react-table'
import { Tag, Text } from '@vtex/shoreline'
import { TsTable } from '@vtex/shoreline-ts-table'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'

export const EPISODES_PAGE_SIZE = 20

const episodeTableColumns: ColumnDef<EpisodeListItem>[] = [
	{
		accessorKey: 'season',
		header: 'Season',
		cell: ({ getValue }) => <Tag color="blue">S{getValue<number>()}</Tag>,
	},
	{
		accessorKey: 'episode_number',
		header: 'Episode',
		cell: ({ getValue }) => <Tag color="gray">E{getValue<number>()}</Tag>,
	},
	{
		accessorKey: 'name',
		header: 'Title',
	},
	{
		accessorKey: 'airdate',
		header: 'Air date',
		cell: ({ getValue }) => (
			<Text variant="body">{formatAirdate(getValue<string>())}</Text>
		),
	},
]

export type EpisodesTableProps = {
	episodes: EpisodeListItem[]
	onEpisodeSelect: (episode: EpisodeListItem) => void
}

export function EpisodesTable({
	episodes,
	onEpisodeSelect,
}: EpisodesTableProps) {
	return (
		<TsTable<EpisodeListItem>
			data={episodes}
			columns={episodeTableColumns}
			columnWidths={['auto', 'auto', 'minmax(12rem, 1fr)', 'auto']}
			options={{
				getRowId: (row) => String(row.id),
			}}
			rowClick={{
				type: 'action',
				onClick: (row) => {
					onEpisodeSelect(row.original)
				},
			}}
		/>
	)
}
