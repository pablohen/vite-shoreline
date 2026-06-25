/// <reference types="vitest/config" />
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		react(),
	],
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.{test,spec}.{ts,tsx}',
				'src/routeTree.gen.ts',
				'src/main.tsx',
				'src/shoreline-css.d.ts',
			],
			reporter: ['text', 'html'],
		},
	},
})
