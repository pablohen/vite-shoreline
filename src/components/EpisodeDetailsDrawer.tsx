import { Flex, Heading, Stack, Tag, Text, Tooltip } from '@vtex/shoreline'
import { useSimpsonsDetailQuery } from '../hooks/use-simpsons-detail-query.ts'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'

const SYNOPSIS_TOOLTIP_THRESHOLD = 120

export type EpisodeDetailsDrawerProps = {
	episodeId: number | null
	preview: EpisodeListItem | null
}

export function EpisodeDetailsDrawer({
	episodeId,
	preview,
}: EpisodeDetailsDrawerProps) {
	const { data, isPending, isError, error } = useSimpsonsDetailQuery(
		'episodes',
		episodeId,
	)

	const displayEpisode = data ?? preview
	const title = preview?.name ?? displayEpisode?.name ?? 'Episode'
	const descriptionText = data?.description?.trim()
	const synopsisText = displayEpisode?.synopsis?.trim()
	const showSynopsisTooltip = Boolean(
		synopsisText && synopsisText.length > SYNOPSIS_TOOLTIP_THRESHOLD,
	)
	const errorMessage = getErrorMessage(
		isError,
		error,
		'Failed to load episode details',
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
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close episode details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={Boolean(displayEpisode)}
		>
			<Stack space="$space-2">
				<Flex align="center" gap="$space-2" style={{ flexWrap: 'wrap' }}>
					<Tag color="blue">S{displayEpisode?.season}</Tag>
					<Tag color="gray">E{displayEpisode?.episode_number}</Tag>
					{Boolean(displayEpisode?.airdate) && (
						<Text as="span" variant="caption1">
							Aired {formatAirdate(displayEpisode?.airdate ?? '')}
						</Text>
					)}
				</Flex>
				<DetailImage
					src={simpsonsImageUrl(displayEpisode?.image_path ?? '')}
					alt={`${title} — promotional still`}
					width={640}
					height={360}
				/>
				<Stack space="$space-2">
					<Stack space="$space-1">
						<Heading level={5} variant="display3">
							Description
						</Heading>
						<Text as="p" variant="body">
							{descriptionText || '—'}
						</Text>
					</Stack>

					<Stack space="$space-1">
						<Heading level={5} variant="display3">
							Synopsis
						</Heading>
						{showSynopsisTooltip ? (
							<Tooltip label={synopsisText}>{synopsis}</Tooltip>
						) : (
							synopsis
						)}
					</Stack>
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
