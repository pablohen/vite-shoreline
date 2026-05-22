import {
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHeaderCell,
	TableRow,
} from '@vtex/shoreline'
import { SIMPSONS_PAGE_SIZE } from '../simpsons-api.ts'

export type TableAreaSkeletonProps = {
	rowCount?: number
	columnCount?: number
}

const SKELETON_HEADER_KEYS = ['season', 'episode', 'title', 'airdate'] as const
const SKELETON_ROW_KEYS = [
	'row-a',
	'row-b',
	'row-c',
	'row-d',
	'row-e',
	'row-f',
	'row-g',
	'row-h',
	'row-i',
	'row-j',
	'row-k',
	'row-l',
	'row-m',
	'row-n',
	'row-o',
	'row-p',
	'row-q',
	'row-r',
	'row-s',
	'row-t',
] as const

export function TableAreaSkeleton({
	rowCount = SIMPSONS_PAGE_SIZE,
	columnCount = 4,
}: TableAreaSkeletonProps) {
	const headerKeys = SKELETON_HEADER_KEYS.slice(0, columnCount)
	const rowKeys = SKELETON_ROW_KEYS.slice(0, rowCount)

	return (
		<Table>
			<TableHeader>
				<TableRow>
					{headerKeys.map((headerKey) => (
						<TableHeaderCell key={headerKey}>
							<Skeleton height="1rem" width="5rem" />
						</TableHeaderCell>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{rowKeys.map((rowKey) => (
					<TableRow key={rowKey}>
						{headerKeys.map((headerKey) => (
							<TableCell key={`${rowKey}-${headerKey}`}>
								<Skeleton
									height="1rem"
									width={headerKey === 'title' ? '100%' : '4rem'}
								/>
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
