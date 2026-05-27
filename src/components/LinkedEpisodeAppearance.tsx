import { Button, Heading, Stack } from '@vtex/shoreline'
import type { AppearanceRef } from '../simpsons-api.ts'

export type LinkedEpisodeAppearanceProps = {
	appearance: AppearanceRef | null | undefined
	heading?: string
	onNavigate: (episodeId: number) => void
}

export function LinkedEpisodeAppearance({
	appearance,
	heading = 'First appearance',
	onNavigate,
}: LinkedEpisodeAppearanceProps) {
	if (appearance?.id == null || !appearance.name) {
		return null
	}

	return (
		<Stack space="$space-1">
			<Heading level={5} variant="display3">
				{heading}
			</Heading>
			<Button variant="tertiary" onClick={() => onNavigate(appearance.id)}>
				{appearance.name}
			</Button>
		</Stack>
	)
}
