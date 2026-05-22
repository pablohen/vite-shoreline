import { Heading, Stack, Tag, Text } from '@vtex/shoreline'
import { useSimpsonsDetailQuery } from '../hooks/use-simpsons-detail-query.ts'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'

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
	const errorMessage = getErrorMessage(
		isError,
		error,
		'Failed to load episode details',
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
				<Stack horizontal space="$space-2">
					<Tag color="blue">S{displayEpisode?.season}</Tag>
					<Tag color="gray">E{displayEpisode?.episode_number}</Tag>
					{Boolean(displayEpisode?.airdate) && (
						<Text as="span" variant="caption1">
							Aired {formatAirdate(displayEpisode?.airdate ?? '')}
						</Text>
					)}
				</Stack>
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
						<Text as="p" variant="body">
							{synopsisText || '—'}
						</Text>
					</Stack>
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
