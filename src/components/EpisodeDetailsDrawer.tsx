import { Flex, Stack, Tag, Text } from '@vtex/shoreline'
import { useDetailDrawerContent } from '../hooks/use-detail-drawer-content.ts'
import type { EpisodeListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { ClampedSynopsis } from './ClampedSynopsis.tsx'
import { DetailImage } from './DetailImage.tsx'
import { DetailSection } from './DetailSection.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'

export type EpisodeDetailsDrawerProps = {
	episodeId: number | null
	preview: EpisodeListItem | null
}

export function EpisodeDetailsDrawer({
	episodeId,
	preview,
}: EpisodeDetailsDrawerProps) {
	const {
		display: displayEpisode,
		title,
		descriptionText,
		errorMessage,
		isPending,
		hasContent,
	} = useDetailDrawerContent(
		'episodes',
		episodeId,
		preview,
		'Episode',
		'Failed to load episode details',
	)

	return (
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close episode details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={hasContent}
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
					<DetailSection heading="Description">
						<Text as="p" variant="body">
							{descriptionText || '—'}
						</Text>
					</DetailSection>

					<DetailSection heading="Synopsis">
						<ClampedSynopsis text={displayEpisode?.synopsis} />
					</DetailSection>
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
