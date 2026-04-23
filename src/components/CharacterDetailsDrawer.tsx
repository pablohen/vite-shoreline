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
import type { ComponentProps } from 'react'
import {
	type CharacterListItem,
	fetchCharacterById,
	simpsonsImageUrl,
} from '../simpsons-api.ts'
import { formatAirdate } from '../utils/format-airdate.ts'

function statusColor(status: string): ComponentProps<typeof Tag>['color'] {
	const normalized = status.toLowerCase()
	if (normalized === 'alive') {
		return 'green'
	}
	if (normalized === 'deceased') {
		return 'red'
	}
	return 'gray'
}

export type CharacterDetailsDrawerProps = {
	characterId: number | null
	preview: CharacterListItem | null
}

export function CharacterDetailsDrawer({
	characterId,
	preview,
}: CharacterDetailsDrawerProps) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['characters', 'detail', characterId] as const,
		queryFn: () => {
			if (characterId == null) {
				throw new Error('No character id')
			}
			return fetchCharacterById(characterId)
		},
		enabled: characterId != null,
	})

	const display = data ?? preview
	const title = preview?.name ?? display?.name ?? 'Character'
	const descriptionText = data?.description?.trim()
	const phrases = data?.phrases ?? []
	const errorMessage = isError
		? error instanceof Error
			? error.message
			: 'Failed to load character details'
		: null

	return (
		<DrawerPopover>
			<DrawerHeader>
				<DrawerHeading>{title}</DrawerHeading>
				<DrawerDismiss label="Close character details" />
			</DrawerHeader>
			<DrawerContent>
				<Stack space="$space-4">
					{Boolean(errorMessage) && (
						<Alert variant="critical">{errorMessage}</Alert>
					)}

					{isPending && !display && (
						<Spinner size={24} description="Loading details" />
					)}

					{Boolean(display) && (
						<>
							<Stack horizontal space="$space-2">
								<Tag color="blue">{display?.gender}</Tag>
								<Tag
									variant="secondary"
									color={statusColor(display?.status ?? '')}
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
									{data?.birthdate
										? `Born ${formatAirdate(data.birthdate)}`
										: null}
								</Text>
							)}
							<img
								src={simpsonsImageUrl(display?.portrait_path ?? '')}
								alt={`${title} — portrait`}
								width={400}
								height={400}
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
						</>
					)}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
