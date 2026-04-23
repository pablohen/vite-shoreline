import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@vtex/shoreline/css'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		// This infers the type of our router and registers it across your entire project
		router: typeof router
	}
}

const rootEl = document.getElementById('root')
if (!rootEl) {
	throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
