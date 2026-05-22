import { z } from 'zod'

const API_BASE = 'https://thesimpsonsapi.com/api'
const IMAGE_BASE = 'https://cdn.thesimpsonsapi.com/500'

/** API returns 20 items per page (fixed). */
export const SIMPSONS_PAGE_SIZE = 20

export type SimpsonsResource = 'episodes' | 'characters' | 'locations'

export type PaginatedResponse<T> = {
	count: number
	pages: number
	results: T[]
}

const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		count: z.number(),
		pages: z.number(),
		results: z.array(itemSchema),
	})

const episodeListItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	season: z.number(),
	episode_number: z.number(),
	airdate: z.string(),
	synopsis: z.string(),
	image_path: z.string(),
})

const episodeDetailSchema = episodeListItemSchema.extend({
	description: z.string().optional(),
})

const characterListItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	occupation: z.string(),
	gender: z.string(),
	status: z.string(),
	portrait_path: z.string(),
})

const characterDetailSchema = characterListItemSchema.extend({
	description: z.string().optional(),
	age: z.number().optional(),
	birthdate: z.string().nullable().optional(),
	phrases: z.array(z.string()).optional(),
	first_appearance_ep: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullable()
		.optional(),
})

const locationListItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	town: z.string(),
	use: z.string(),
	image_path: z.string(),
})

const locationDetailSchema = locationListItemSchema.extend({
	description: z.string().optional(),
})

export type EpisodeListItem = z.infer<typeof episodeListItemSchema>
export type EpisodeDetail = z.infer<typeof episodeDetailSchema>
export type EpisodesListResponse = PaginatedResponse<EpisodeListItem>

export type CharacterListItem = z.infer<typeof characterListItemSchema>
export type CharacterDetail = z.infer<typeof characterDetailSchema>
export type CharactersListResponse = PaginatedResponse<CharacterListItem>

export type LocationListItem = z.infer<typeof locationListItemSchema>
export type LocationDetail = z.infer<typeof locationDetailSchema>
export type LocationsListResponse = PaginatedResponse<LocationListItem>

const resourceSchemas = {
	episodes: {
		list: paginatedResponseSchema(episodeListItemSchema),
		detail: episodeDetailSchema,
	},
	characters: {
		list: paginatedResponseSchema(characterListItemSchema),
		detail: characterDetailSchema,
	},
	locations: {
		list: paginatedResponseSchema(locationListItemSchema),
		detail: locationDetailSchema,
	},
} as const

async function parseJson<T>(res: Response, schema: z.ZodType<T>): Promise<T> {
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`)
	}
	const json: unknown = await res.json()
	const parsed = schema.safeParse(json)
	if (!parsed.success) {
		throw new Error(`Invalid API response: ${parsed.error.message}`)
	}
	return parsed.data
}

/** Resolves CDN URLs for episode stills, character portraits, location images, etc. */
export function simpsonsImageUrl(imagePath: string): string {
	if (imagePath.startsWith('http')) {
		return imagePath
	}
	return `${IMAGE_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

export async function fetchPage(
	resource: 'episodes',
	page: number,
): Promise<EpisodesListResponse>
export async function fetchPage(
	resource: 'characters',
	page: number,
): Promise<CharactersListResponse>
export async function fetchPage(
	resource: 'locations',
	page: number,
): Promise<LocationsListResponse>
export async function fetchPage(
	resource: SimpsonsResource,
	page: number,
): Promise<
	EpisodesListResponse | CharactersListResponse | LocationsListResponse
> {
	const url = new URL(`${API_BASE}/${resource}`)
	url.searchParams.set('page', String(page))
	const res = await fetch(url.toString())

	switch (resource) {
		case 'episodes':
			return parseJson(res, resourceSchemas.episodes.list)
		case 'characters':
			return parseJson(res, resourceSchemas.characters.list)
		case 'locations':
			return parseJson(res, resourceSchemas.locations.list)
	}
}

export async function fetchById(
	resource: 'episodes',
	id: number,
): Promise<EpisodeDetail>
export async function fetchById(
	resource: 'characters',
	id: number,
): Promise<CharacterDetail>
export async function fetchById(
	resource: 'locations',
	id: number,
): Promise<LocationDetail>
export async function fetchById(
	resource: SimpsonsResource,
	id: number,
): Promise<EpisodeDetail | CharacterDetail | LocationDetail> {
	const res = await fetch(`${API_BASE}/${resource}/${id}`)

	switch (resource) {
		case 'episodes':
			return parseJson(res, resourceSchemas.episodes.detail)
		case 'characters':
			return parseJson(res, resourceSchemas.characters.detail)
		case 'locations':
			return parseJson(res, resourceSchemas.locations.detail)
	}
}

export async function fetchEpisodesPage(
	page: number,
): Promise<EpisodesListResponse> {
	return fetchPage('episodes', page)
}

export async function fetchEpisodeById(id: number): Promise<EpisodeDetail> {
	return fetchById('episodes', id)
}

export async function fetchCharactersPage(
	page: number,
): Promise<CharactersListResponse> {
	return fetchPage('characters', page)
}

export async function fetchCharacterById(id: number): Promise<CharacterDetail> {
	return fetchById('characters', id)
}

export async function fetchLocationsPage(
	page: number,
): Promise<LocationsListResponse> {
	return fetchPage('locations', page)
}

export async function fetchLocationById(id: number): Promise<LocationDetail> {
	return fetchById('locations', id)
}
