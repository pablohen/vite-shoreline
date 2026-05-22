import { IconMapPin, IconPlayCircle, IconUser, Text } from '@vtex/shoreline'
import type { ComponentType } from 'react'
import { SIMPSONS_TAB_IDS, type SimpsonsTabId } from '../simpsons-tabs.ts'

const TAB_NAV_CONFIG: Record<
	SimpsonsTabId,
	{ label: string; Icon: ComponentType }
> = {
	episodes: { label: 'Episodes', Icon: IconPlayCircle },
	characters: { label: 'Characters', Icon: IconUser },
	locations: { label: 'Locations', Icon: IconMapPin },
}

export function simpsonsPanelId(tabId: SimpsonsTabId): string {
	return `simpsons-panel-${tabId}`
}

export type SimpsonsBottomNavProps = {
	tab: SimpsonsTabId
	onTabChange: (tab: SimpsonsTabId) => void
}

export function SimpsonsBottomNav({
	tab,
	onTabChange,
}: SimpsonsBottomNavProps) {
	return (
		<nav
			aria-label="Browse sections"
			style={{
				position: 'sticky',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 100,
				flexShrink: 0,
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'stretch',
				background: 'var(--sl-bg-base)',
				borderTop: 'var(--sl-border-base)',
				paddingBottom: 'env(safe-area-inset-bottom, 0px)',
			}}
		>
			{SIMPSONS_TAB_IDS.map((tabId) => {
				const { label, Icon } = TAB_NAV_CONFIG[tabId]
				const isSelected = tab === tabId

				return (
					<button
						key={tabId}
						type="button"
						role="tab"
						aria-selected={isSelected}
						aria-controls={simpsonsPanelId(tabId)}
						onClick={() => onTabChange(tabId)}
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 'var(--sl-space-1)',
							minHeight: '4rem',
							padding: 'var(--sl-space-2) var(--sl-space-1)',
							border: 'none',
							background: 'transparent',
							cursor: 'pointer',
							color: isSelected
								? 'var(--sl-fg-base)'
								: 'var(--sl-fg-base-soft)',
							fontWeight: isSelected ? 600 : 400,
						}}
					>
						<Icon />
						<Text
							as="span"
							variant="caption1"
							style={{ color: 'inherit', fontWeight: 'inherit' }}
						>
							{label}
						</Text>
					</button>
				)
			})}
		</nav>
	)
}
