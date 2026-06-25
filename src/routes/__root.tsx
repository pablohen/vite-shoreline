import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, stripSearchParams } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ToastStack } from '@vtex/shoreline'
import { SimpsonsBrowsePage } from '../pages/SimpsonsBrowsePage.tsx'
import {
	type AppSearch,
	defaultSearchValues,
	searchSchema,
} from '../search-schema.ts'

export const Route = createRootRoute({
	validateSearch: searchSchema,
	search: {
		middlewares: [stripSearchParams(defaultSearchValues)],
	},
	component: RootLayout,
})

function RootLayout() {
	const { page, tab, detail } = Route.useSearch()
	const navigate = Route.useNavigate() as (opts: {
		to: '.'
		search: AppSearch | ((prev: AppSearch) => AppSearch)
	}) => Promise<void>

	return (
		<>
			<SimpsonsBrowsePage
				tab={tab}
				page={page}
				detail={detail}
				onTabChange={(nextTab) => {
					void navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							tab: nextTab,
							page: 1,
							detail: undefined,
						}),
					})
				}}
				onPageChange={(nextPage) => {
					void navigate({
						to: '.',
						search: (prev) => ({ ...prev, page: nextPage }),
					})
				}}
				onDetailChange={(nextDetail) => {
					void navigate({
						to: '.',
						search: (prev) => ({ ...prev, detail: nextDetail }),
					})
				}}
				onNavigateToResourceDetail={(nextTab, detailId) => {
					void navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							tab: nextTab,
							page: 1,
							detail: detailId,
						}),
					})
				}}
			/>
			<ToastStack />
			{import.meta.env.DEV ? (
				<>
					<ReactQueryDevtools initialIsOpen={false} />
					<TanStackRouterDevtools />
				</>
			) : null}
		</>
	)
}
