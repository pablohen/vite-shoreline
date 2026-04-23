import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, stripSearchParams } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { z } from 'zod'
import { EpisodesPage } from '../components/EpisodesPage.tsx'

const defaultSearchValues = { page: 1 }

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).default(1).catch(1),
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
	const { page } = Route.useSearch()
	const navigate = Route.useNavigate() as (opts: {
		to: '.'
		search: AppSearch | ((prev: AppSearch) => AppSearch)
	}) => Promise<void>

	return (
		<>
			<EpisodesPage
				page={page}
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
