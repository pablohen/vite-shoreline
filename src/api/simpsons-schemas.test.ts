import { describe, expect, it } from 'vitest'
import { resourceSchemas } from './simpsons-schemas.ts'

const episodeListItem = {
	id: 1,
	name: 'Simpsons Roasting on an Open Fire',
	season: 1,
	episode_number: 1,
	airdate: '1989-12-17',
	synopsis: 'Christmas special.',
	image_path: '/episodes/1.jpg',
}

const characterListItem = {
	id: 1,
	name: 'Homer Simpson',
	occupation: 'Safety Inspector',
	gender: 'Male',
	status: 'Alive',
	portrait_path: '/characters/1.jpg',
}

const locationListItem = {
	id: 1,
	name: '742 Evergreen Terrace',
	town: 'Springfield',
	use: 'Residential',
	image_path: '/locations/1.jpg',
}

describe('resourceSchemas', () => {
	describe('episodes.list', () => {
		it('accepts a valid paginated response', () => {
			const result = resourceSchemas.episodes.list.safeParse({
				count: 1,
				pages: 1,
				results: [episodeListItem],
			})
			expect(result.success).toBe(true)
		})

		it('rejects missing required fields', () => {
			const result = resourceSchemas.episodes.list.safeParse({
				count: 1,
				pages: 1,
				results: [{ id: 1 }],
			})
			expect(result.success).toBe(false)
		})
	})

	describe('characters.list', () => {
		it('accepts a valid paginated response', () => {
			const result = resourceSchemas.characters.list.safeParse({
				count: 1,
				pages: 1,
				results: [characterListItem],
			})
			expect(result.success).toBe(true)
		})

		it('rejects wrong field types', () => {
			const result = resourceSchemas.characters.list.safeParse({
				count: '1',
				pages: 1,
				results: [characterListItem],
			})
			expect(result.success).toBe(false)
		})
	})

	describe('locations.list', () => {
		it('accepts a valid paginated response', () => {
			const result = resourceSchemas.locations.list.safeParse({
				count: 1,
				pages: 1,
				results: [locationListItem],
			})
			expect(result.success).toBe(true)
		})

		it('rejects missing results array', () => {
			const result = resourceSchemas.locations.list.safeParse({
				count: 1,
				pages: 1,
			})
			expect(result.success).toBe(false)
		})
	})

	describe('detail schemas', () => {
		it('accepts episode detail with optional description', () => {
			const result = resourceSchemas.episodes.detail.safeParse({
				...episodeListItem,
				description: 'Extended synopsis.',
			})
			expect(result.success).toBe(true)
		})

		it('accepts character detail with optional fields', () => {
			const result = resourceSchemas.characters.detail.safeParse({
				...characterListItem,
				age: 39,
				birthdate: '1956-05-12',
				phrases: ['Doh!'],
			})
			expect(result.success).toBe(true)
		})
	})
})
