import { Heading, Stack, Text } from '@vtex/shoreline'
import type { AppearanceRef } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { ClampedSynopsis } from './ClampedSynopsis.tsx'

export type ShortAppearanceBlockProps = {
	appearance: AppearanceRef | null | undefined
	heading?: string
}

export function ShortAppearanceBlock({
	appearance,
	heading = 'First Tracey Ullman short',
}: ShortAppearanceBlockProps) {
	if (appearance?.id == null || !appearance.name) {
		return null
	}

	const synopsisText = appearance.synopsis?.trim()

	return (
		<Stack space="$space-1">
			<Heading level={5} variant="display3">
				{heading}
			</Heading>
			<Text as="p" variant="body">
				{appearance.name}
			</Text>
			{Boolean(appearance.airdate) && (
				<Text as="p" variant="caption1">
					Aired {formatAirdate(appearance.airdate)}
				</Text>
			)}
			{synopsisText ? <ClampedSynopsis text={appearance.synopsis} /> : null}
		</Stack>
	)
}
