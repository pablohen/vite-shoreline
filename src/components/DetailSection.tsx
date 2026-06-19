import { Heading, Stack } from '@vtex/shoreline'
import type { ReactNode } from 'react'

export type DetailSectionProps = {
	heading: string
	children: ReactNode
}

export function DetailSection({ heading, children }: DetailSectionProps) {
	return (
		<Stack space="$space-1">
			<Heading level={5} variant="display3">
				{heading}
			</Heading>
			{children}
		</Stack>
	)
}
