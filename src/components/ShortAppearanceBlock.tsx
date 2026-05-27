import { Heading, Stack, Text, Tooltip } from '@vtex/shoreline'
import type { AppearanceRef } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'

const SYNOPSIS_TOOLTIP_THRESHOLD = 120

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
	const showSynopsisTooltip = Boolean(
		synopsisText && synopsisText.length > SYNOPSIS_TOOLTIP_THRESHOLD,
	)

	const synopsis = (
		<Text
			as="p"
			variant="body"
			style={
				showSynopsisTooltip
					? {
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}
					: undefined
			}
		>
			{synopsisText || '—'}
		</Text>
	)

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
			{synopsisText ? (
				showSynopsisTooltip ? (
					<Tooltip label={synopsisText}>{synopsis}</Tooltip>
				) : (
					synopsis
				)
			) : null}
		</Stack>
	)
}
