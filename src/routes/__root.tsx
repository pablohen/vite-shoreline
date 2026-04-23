import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, stripSearchParams } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { z } from 'zod'
import { SimpsonsBrowsePage } from '../pages/SimpsonsBrowsePage.tsx'
import { type SimpsonsTabId, simpsonsTabSchema } from '../simpsons-tabs.ts'

const defaultSearchValues = {
	page: 1,
	tab: 'episodes' as const satisfies SimpsonsTabId,
}

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).default(1).catch(1),
	tab: simpsonsTabSchema,
})

type AppSearch = z.infer<typeof searchSchema>

export const Route = createRootRoute({
	validateSearch: searchSchema,
	search: {
		middlewares: [stripSearchParams(defaultSearchValues)],
	},
	component: RootLayout,
})

function RootLayout() {
	const { page, tab } = Route.useSearch()
	const navigate = Route.useNavigate() as (opts: {
		to: '.'
		search: AppSearch | ((prev: AppSearch) => AppSearch)
	}) => Promise<void>

	return (
		<>
			<SimpsonsBrowsePage
				tab={tab}
				page={page}
				onTabChange={(nextTab) => {
					void navigate({
						to: '.',
						search: (prev) => ({ ...prev, tab: nextTab, page: 1 }),
					})
				}}
				onPageChange={(nextPage) => {
					void navigate({
						to: '.',
						search: (prev) => ({ ...prev, page: nextPage }),
					})
				}}
			/>
			{import.meta.env.DEV ? (
				<ReactQueryDevtools initialIsOpen={false} />
			) : null}
			<TanStackRouterDevtools />
		</>
	)
}
