import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchById, fetchPage, simpsonsImageUrl } from './simpsons-client.ts'

const episodeListItem = {
	id: 1,
	name: 'Simpsons Roasting on an Open Fire',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Christmas special.',
	image_path: '/episodes/1.jpg',
}

const validEpisodesList = {
	count: 1,
	pages: 1,
	results: [episodeListItem],
}

function mockFetchResponse(body: unknown, ok = true, status = 200) {
	return {
		ok,
		status,
		statusText: ok ? 'OK' : 'Not Found',
		json: () => Promise.resolve(body),
	} as Response
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('simpsonsImageUrl', () => {
	it('returns absolute URLs unchanged', () => {
		const url = 'https://example.com/image.jpg'
		expect(simpsonsImageUrl(url)).toBe(url)
	})

	it('prepends CDN base for relative paths with leading slash', () => {
		expect(simpsonsImageUrl('/episodes/1.jpg')).toBe(
			'https://cdn.thesimpsonsapi.com/500/episodes/1.jpg',
		)
	})

	it('prepends CDN base and slash for relative paths without leading slash', () => {
		expect(simpsonsImageUrl('episodes/1.jpg')).toBe(
			'https://cdn.thesimpsonsapi.com/500/episodes/1.jpg',
		)
	})
})

describe('fetchPage', () => {
	it('fetches and validates a paginated response', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(mockFetchResponse(validEpisodesList)),
		)

		const result = await fetchPage('episodes', 1)

		expect(result.results).toHaveLength(1)
		expect(fetch).toHaveBeenCalledWith(
			'https://thesimpsonsapi.com/api/episodes?page=1',
		)
	})

	it('throws on HTTP error', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(mockFetchResponse(null, false, 500)),
		)

		await expect(fetchPage('episodes', 1)).rejects.toThrow(
			'Request failed: 500 Not Found',
		)
	})

	it('throws on invalid response shape', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(mockFetchResponse({ invalid: true })),
		)

		await expect(fetchPage('episodes', 1)).rejects.toThrow(
			'Invalid API response:',
		)
	})
})

describe('fetchById', () => {
	it('fetches and validates a detail response', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(mockFetchResponse(episodeListItem)),
		)

		const result = await fetchById('episodes', 1)

		expect(result.id).toBe(1)
		expect(fetch).toHaveBeenCalledWith(
			'https://thesimpsonsapi.com/api/episodes/1',
		)
	})

	it('throws on HTTP error', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(mockFetchResponse(null, false, 404)),
		)

		await expect(fetchById('episodes', 999)).rejects.toThrow(
			'Request failed: 404 Not Found',
		)
	})
})
