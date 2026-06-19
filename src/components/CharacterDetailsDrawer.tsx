import { Stack, Tag, Text } from '@vtex/shoreline'
import { useDetailDrawerContent } from '../hooks/use-detail-drawer-content.ts'
import type { CharacterListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { characterStatusColor } from '../utils/character-status-color.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailSection } from './DetailSection.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'
import { LinkedEpisodeAppearance } from './LinkedEpisodeAppearance.tsx'
import { ShortAppearanceBlock } from './ShortAppearanceBlock.tsx'

export type CharacterDetailsDrawerProps = {
	characterId: number | null
	preview: CharacterListItem | null
	onNavigateToEpisode: (episodeId: number) => void
}

export function CharacterDetailsDrawer({
	characterId,
	preview,
	onNavigateToEpisode,
}: CharacterDetailsDrawerProps) {
	const {
		data,
		display,
		title,
		descriptionText,
		errorMessage,
		isPending,
		hasContent,
	} = useDetailDrawerContent(
		'characters',
		characterId,
		preview,
		'Character',
		'Failed to load character details',
	)

	const phrases = data?.phrases ?? []

	return (
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close character details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={hasContent}
		>
			<Stack space="$space-2">
				<Stack horizontal space="$space-2">
					<Tag color="blue">{display?.gender}</Tag>
					<Tag
						variant="secondary"
						color={characterStatusColor(display?.status ?? '')}
					>
						{display?.status}
					</Tag>
					{Boolean(display?.occupation) && (
						<Text as="span" variant="caption1">
							{display?.occupation}
						</Text>
					)}
				</Stack>
				{(data?.age != null || data?.birthdate) && (
					<Text as="p" variant="caption1">
						{data?.age != null ? `Age ${data.age}` : null}
						{data?.age != null && data?.birthdate ? ' · ' : null}
						{data?.birthdate ? `Born ${formatAirdate(data.birthdate)}` : null}
					</Text>
				)}
				<DetailImage
					src={simpsonsImageUrl(display?.portrait_path ?? '')}
					alt={`${title} — portrait`}
					width={400}
					height={400}
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

					{phrases.length > 0 && (
						<DetailSection heading="Phrases">
							<ul
								style={{
									margin: 0,
									paddingLeft: '1.25rem',
									display: 'flex',
									flexDirection: 'column',
									gap: 'var(--sl-space-2, 8px)',
								}}
							>
								{phrases.map((phrase) => (
									<li key={`${characterId}-${phrase}`}>
										<Text as="span" variant="body">
											“{phrase}”
										</Text>
									</li>
								))}
							</ul>
						</DetailSection>
					)}
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
