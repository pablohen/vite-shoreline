import { Stack, Tag, Text } from '@vtex/shoreline'
import { useDetailDrawerContent } from '../hooks/use-detail-drawer-content.ts'
import type { LocationListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailSection } from './DetailSection.tsx'
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
	const {
		data,
		display,
		title,
		descriptionText,
		errorMessage,
		isPending,
		hasContent,
	} = useDetailDrawerContent(
		'locations',
		locationId,
		preview,
		'Location',
		'Failed to load location details',
	)

	return (
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close location details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={hasContent}
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
					<DetailSection heading="Description">
						<Text as="p" variant="body">
							{descriptionText || '—'}
						</Text>
					</DetailSection>

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
