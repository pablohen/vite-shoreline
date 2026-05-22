import {
	Alert,
	DrawerContent,
	DrawerDismiss,
	DrawerHeader,
	DrawerHeading,
	DrawerPopover,
	Spinner,
	Stack,
} from '@vtex/shoreline'
import type { ReactNode } from 'react'

export type DetailsDrawerShellProps = {
	title: string
	dismissLabel: string
	errorMessage: string | null
	isPending: boolean
	hasContent: boolean
	children: ReactNode
}

export function DetailsDrawerShell({
	title,
	dismissLabel,
	errorMessage,
	isPending,
	hasContent,
	children,
}: DetailsDrawerShellProps) {
	return (
		<DrawerPopover>
			<DrawerHeader>
				<DrawerHeading>{title}</DrawerHeading>
				<DrawerDismiss label={dismissLabel} />
			</DrawerHeader>
			<DrawerContent>
				<Stack space="$space-4">
					{Boolean(errorMessage) && (
						<Alert variant="critical">{errorMessage}</Alert>
					)}

					{isPending && !hasContent && (
						<Spinner size={24} description="Loading details" />
					)}

					{hasContent ? children : null}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
