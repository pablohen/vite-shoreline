import { useQuery } from '@tanstack/react-query'
import {
	Alert,
	DrawerContent,
	DrawerDismiss,
	DrawerHeader,
	DrawerHeading,
	DrawerPopover,
	Heading,
	Spinner,
	Stack,
	Tag,
	Text,
} from '@vtex/shoreline'
import {
	type EpisodeListItem,
	episodeImageUrl,
	fetchEpisodeById,
} from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'

export type EpisodeDetailsDrawerProps = {
	episodeId: number | null
	preview: EpisodeListItem | null
}

export function EpisodeDetailsDrawer({
	episodeId,
	preview,
}: EpisodeDetailsDrawerProps) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['episodes', 'detail', episodeId] as const,
		queryFn: () => {
			if (episodeId == null) {
				throw new Error('No episode id')
			}
			return fetchEpisodeById(episodeId)
		},
		enabled: episodeId != null,
	})

	const displayEpisode = data ?? preview
	const title = preview?.name ?? displayEpisode?.name ?? 'Episode'
	const descriptionText = data?.description?.trim()
	const synopsisText = displayEpisode?.synopsis?.trim()

	const errorMessage = isError
		? error instanceof Error
			? error.message
			: 'Failed to load episode details'
		: null

	return (
		<DrawerPopover>
			<DrawerHeader>
				<DrawerHeading>{title}</DrawerHeading>
				<DrawerDismiss label="Close episode details" />
			</DrawerHeader>
			<DrawerContent>
				<Stack space="$space-4">
					{Boolean(errorMessage) && (
						<Alert variant="critical">{errorMessage}</Alert>
					)}

					{isPending && !displayEpisode && (
						<Spinner size={24} description="Loading details" />
					)}

					{Boolean(displayEpisode) && (
						<>
							<Stack horizontal space="$space-2">
								<Tag color="blue">S{displayEpisode?.season}</Tag>
								<Tag color="gray">E{displayEpisode?.episode_number}</Tag>
								{Boolean(displayEpisode?.airdate) && (
									<Text as="span" variant="caption1">
										Aired {formatAirdate(displayEpisode?.airdate ?? '')}
									</Text>
								)}
							</Stack>
							<img
								src={episodeImageUrl(displayEpisode?.image_path ?? '')}
								alt={`${title} — promotional still`}
								width={640}
								height={360}
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: 'var(--sl-border-radius-2, 8px)',
								}}
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
						</>
					)}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
