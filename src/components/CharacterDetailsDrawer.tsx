import { Heading, Stack, Tag, Text } from '@vtex/shoreline'
import { useSimpsonsDetailQuery } from '../hooks/use-simpsons-detail-query.ts'
import type { CharacterListItem } from '../simpsons-api.ts'
import { simpsonsImageUrl } from '../simpsons-api.ts'
import { characterStatusColor } from '../utils/character-status-color.ts'
import { formatAirdate } from '../utils/format-airdate.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import { DetailImage } from './DetailImage.tsx'
import { DetailsDrawerShell } from './DetailsDrawerShell.tsx'

export type CharacterDetailsDrawerProps = {
	characterId: number | null
	preview: CharacterListItem | null
}

export function CharacterDetailsDrawer({
	characterId,
	preview,
}: CharacterDetailsDrawerProps) {
	const { data, isPending, isError, error } = useSimpsonsDetailQuery(
		'characters',
		characterId,
	)

	const display = data ?? preview
	const title = preview?.name ?? display?.name ?? 'Character'
	const descriptionText = data?.description?.trim()
	const phrases = data?.phrases ?? []
	const errorMessage = getErrorMessage(
		isError,
		error,
		'Failed to load character details',
	)

	return (
		<DetailsDrawerShell
			title={title}
			dismissLabel="Close character details"
			errorMessage={errorMessage}
			isPending={isPending}
			hasContent={Boolean(display)}
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
					<Stack space="$space-1">
						<Heading level={5} variant="display3">
							Description
						</Heading>
						<Text as="p" variant="body">
							{descriptionText || '—'}
						</Text>
					</Stack>

					{Boolean(data?.first_appearance_ep?.name) && (
						<Stack space="$space-1">
							<Heading level={5} variant="display3">
								First appearance
							</Heading>
							<Text as="p" variant="body">
								{data?.first_appearance_ep?.name}
							</Text>
						</Stack>
					)}

					{phrases.length > 0 && (
						<Stack space="$space-1">
							<Heading level={5} variant="display3">
								Phrases
							</Heading>
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
						</Stack>
					)}
				</Stack>
			</Stack>
		</DetailsDrawerShell>
	)
}
