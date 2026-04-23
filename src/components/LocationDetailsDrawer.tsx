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
	fetchLocationById,
	type LocationListItem,
	simpsonsImageUrl,
} from '../simpsons-api.ts'

export type LocationDetailsDrawerProps = {
	locationId: number | null
	preview: LocationListItem | null
}

export function LocationDetailsDrawer({
	locationId,
	preview,
}: LocationDetailsDrawerProps) {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ['locations', 'detail', locationId] as const,
		queryFn: () => {
			if (locationId == null) {
				throw new Error('No location id')
			}
			return fetchLocationById(locationId)
		},
		enabled: locationId != null,
	})

	const display = data ?? preview
	const title = preview?.name ?? display?.name ?? 'Location'
	const descriptionText = data?.description?.trim()
	const errorMessage = isError
		? error instanceof Error
			? error.message
			: 'Failed to load location details'
		: null

	return (
		<DrawerPopover>
			<DrawerHeader>
				<DrawerHeading>{title}</DrawerHeading>
				<DrawerDismiss label="Close location details" />
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
								<Tag color="blue">{display?.town}</Tag>
								{Boolean(display?.use) && (
									<Tag variant="secondary" color="gray">
										{display?.use}
									</Tag>
								)}
							</Stack>
							<img
								src={simpsonsImageUrl(display?.image_path ?? '')}
								alt={`${title} — Springfield location`}
								width={640}
								height={360}
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: 'var(--sl-border-radius-2, 8px)',
								}}
							/>
							<Stack space="$space-1">
								<Heading level={5} variant="display3">
									Description
								</Heading>
								<Text as="p" variant="body">
									{descriptionText || '—'}
								</Text>
							</Stack>
						</>
					)}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
