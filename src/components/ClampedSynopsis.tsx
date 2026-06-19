import { Text, Tooltip } from '@vtex/shoreline'

const DEFAULT_LINE_CLAMP = 3
const DEFAULT_TOOLTIP_THRESHOLD = 120

export type ClampedSynopsisProps = {
	text: string | undefined
	lineClamp?: number
	threshold?: number
}

export function ClampedSynopsis({
	text,
	lineClamp = DEFAULT_LINE_CLAMP,
	threshold = DEFAULT_TOOLTIP_THRESHOLD,
}: ClampedSynopsisProps) {
	const synopsisText = text?.trim()
	const showTooltip = Boolean(synopsisText && synopsisText.length > threshold)

	const content = (
		<Text
			as="p"
			variant="body"
			style={
				showTooltip
					? {
							display: '-webkit-box',
							WebkitLineClamp: lineClamp,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}
					: undefined
			}
		>
			{synopsisText || '—'}
		</Text>
	)

	if (showTooltip) {
		return <Tooltip label={synopsisText}>{content}</Tooltip>
	}

	return content
}
