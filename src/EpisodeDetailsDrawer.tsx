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
import { useEffect, useState } from 'react'
import {
	type EpisodeDetail,
	type EpisodeListItem,
	episodeImageUrl,
	fetchEpisodeById,
} from './simpsons-api.ts'

export type EpisodeDetailsDrawerProps = {
	episodeId: number | null
	preview: EpisodeListItem | null
}

export function EpisodeDetailsDrawer({
	episodeId,
	preview,
}: EpisodeDetailsDrawerProps) {
	const [detail, setDetail] = useState<EpisodeDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (episodeId == null) {
			setDetail(null)
			setError(null)
			return
		}
		let cancelled = false
		setDetail(null)
		setLoading(true)
		setError(null)
		fetchEpisodeById(episodeId)
			.then((d) => {
				if (!cancelled) {
					setDetail(d)
				}
			})
			.catch((e: unknown) => {
				if (!cancelled) {
					setError(
						e instanceof Error ? e.message : 'Failed to load episode details',
					)
					setDetail(null)
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [episodeId])

	const displayEpisode = detail ?? preview
	const title = preview?.name ?? displayEpisode?.name ?? 'Episode'
	const descriptionText = detail?.description?.trim()
	const synopsisText = displayEpisode?.synopsis?.trim()

	return (
		<DrawerPopover>
			<DrawerHeader>
				<DrawerHeading>{title}</DrawerHeading>
				<DrawerDismiss label="Close episode details" />
			</DrawerHeader>
			<DrawerContent>
				<Stack space="$space-4">
					{error ? <Alert variant="critical">{error}</Alert> : null}
					{loading ? (
						<Spinner size={24} description="Loading details" />
					) : displayEpisode ? (
						<>
							<Stack horizontal space="$space-2">
								<Tag color="blue">S{displayEpisode.season}</Tag>
								<Tag color="gray">E{displayEpisode.episode_number}</Tag>
								{displayEpisode.airdate ? (
									<Text as="span" variant="caption1">
										Aired {displayEpisode.airdate}
									</Text>
								) : null}
							</Stack>
							<img
								src={episodeImageUrl(displayEpisode.image_path)}
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
					) : null}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
