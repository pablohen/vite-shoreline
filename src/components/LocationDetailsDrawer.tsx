import { Heading, Stack, Tag, Text } from '@vtex/shoreline'
import { useSimpsonsDetailQuery } from '../hooks/use-simpsons-detail-query.ts'
import type { LocationListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'
import { LinkedEpisodeAppearance } from './LinkedEpisodeAppearance.tsx'
import { ShortAppearanceBlock } from './ShortAppearanceBlock.tsx'

export type LocationDetailsDrawerProps = {
	locationId: number | null
	preview: LocationListItem | null
	onNavigateToEpisode: (episodeId: number) => void
}

export function LocationDetailsDrawer({
	locationId,
	preview,
	onNavigateToEpisode,
}: LocationDetailsDrawerProps) {
	const { data, isPending, isError, error } = useSimpsonsDetailQuery(
		'locations',
		locationId,
	)

	const display = data ?? preview
	const title = preview?.name ?? display?.name ?? 'Location'
	const descriptionText = data?.description?.trim()
	const errorMessage = getErrorMessage(
		isError,
		error,
		'Failed to load location details',
	)

	return (
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close location details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={Boolean(display)}
		>
			<Stack space="$space-2">
				<Stack horizontal space="$space-2">
					<Tag color="blue">{display?.town}</Tag>
					{Boolean(display?.use) && (
						<Tag variant="secondary" color="gray">
							{display?.use}
						</Tag>
					)}
				</Stack>
				<DetailImage
					src={simpsonsImageUrl(display?.image_path ?? '')}
					alt={`${title} — Springfield location`}
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

					<LinkedEpisodeAppearance
						appearance={data?.first_appearance_ep}
						onNavigate={onNavigateToEpisode}
					/>

					<ShortAppearanceBlock appearance={data?.first_appearance_sh} />
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
