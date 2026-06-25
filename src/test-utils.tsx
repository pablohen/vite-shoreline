import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	type RenderHookOptions,
	type RenderOptions,
	render,
	renderHook,
} from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	})
}

export function createQueryWrapper(queryClient = createTestQueryClient()) {
	return function QueryWrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		)
	}
}

export function renderWithQueryClient(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	const queryClient = createTestQueryClient()
	return {
		queryClient,
		...render(ui, { wrapper: createQueryWrapper(queryClient), ...options }),
	}
}

export function renderHookWithQueryClient<Result, Props>(
	renderCallback: (props: Props) => Result,
	options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) {
	const queryClient = createTestQueryClient()
	return {
		queryClient,
		...renderHook(renderCallback, {
			wrapper: createQueryWrapper(queryClient),
			...options,
		}),
	}
}
