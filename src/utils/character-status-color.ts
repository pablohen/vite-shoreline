import type { Tag } from '@vtex/shoreline'
import type { ComponentProps } from 'react'

export function characterStatusColor(
	status: string,
): ComponentProps<typeof Tag>['color'] {
	const normalized = status.toLowerCase()
	if (normalized === 'alive') {
		return 'green'
	}
	if (normalized === 'deceased') {
		return 'red'
	}
	return 'gray'
}
