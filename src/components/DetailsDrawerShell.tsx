import {
	Alert,
	Button,
	DrawerContent,
	DrawerDismiss,
	DrawerHeader,
	DrawerHeading,
	DrawerPopover,
	Flex,
	IconButton,
	IconCopySimple,
	Skeleton,
	Stack,
	toast,
} from '@vtex/shoreline'
import type { ReactNode } from 'react'
import { useIsMobileNav } from '../hooks/use-media-query.ts'

export type DetailsDrawerShellProps = {
	title: string
	dismissLabel: string
	errorMessage: string | null
	isPending: boolean
	hasContent: boolean
	children: ReactNode
}

function DetailsDrawerSkeleton() {
	return (
		<Stack space="$space-4">
			<Flex gap="$space-2">
				<Skeleton height="1.5rem" width="4rem" />
				<Skeleton height="1.5rem" width="4rem" />
			</Flex>
			<Skeleton height="12rem" width="100%" />
			<Stack space="$space-2">
				<Skeleton height="1rem" width="30%" />
				<Skeleton height="4rem" width="100%" />
				<Skeleton height="1rem" width="30%" />
				<Skeleton height="6rem" width="100%" />
			</Stack>
		</Stack>
	)
}

async function copyCurrentUrl() {
	try {
		await navigator.clipboard.writeText(window.location.href)
		toast.success('Link copied')
	} catch {
		toast.critical('Could not copy link')
	}
}

export function DetailsDrawerShell({
	title,
	dismissLabel,
	errorMessage,
	isPending,
	hasContent,
	children,
}: DetailsDrawerShellProps) {
	const isMobileNav = useIsMobileNav()

	const copyLinkAction = isMobileNav ? (
		<IconButton
			variant="tertiary"
			label="Copy link"
			onClick={() => void copyCurrentUrl()}
		>
			<IconCopySimple />
		</IconButton>
	) : (
		<Button variant="tertiary" onClick={() => void copyCurrentUrl()}>
			<IconCopySimple />
			Copy link
		</Button>
	)

	return (
		<DrawerPopover>
			<DrawerHeader>
				{isMobileNav ? (
					<Stack space="$space-3">
						<DrawerHeading>{title}</DrawerHeading>
						<Flex align="center" gap="$space-2">
							{copyLinkAction}
							<DrawerDismiss label={dismissLabel} />
						</Flex>
					</Stack>
				) : (
					<>
						<DrawerHeading>{title}</DrawerHeading>
						<Flex align="center" gap="$space-2">
							{copyLinkAction}
							<DrawerDismiss label={dismissLabel} />
						</Flex>
					</>
				)}
			</DrawerHeader>
			<DrawerContent>
				<Stack space="$space-4">
					{Boolean(errorMessage) && (
						<Alert variant="critical">{errorMessage}</Alert>
					)}

					{isPending && !hasContent && <DetailsDrawerSkeleton />}

					{hasContent ? children : null}
				</Stack>
			</DrawerContent>
		</DrawerPopover>
	)
}
