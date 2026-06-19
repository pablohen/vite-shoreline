import type { z } from 'zod'
import {
	type CharacterDetail,
	type CharactersListResponse,
	type EpisodeDetail,
	type EpisodesListResponse,
	type LocationDetail,
	type LocationsListResponse,
	resourceSchemas,
} from './simpsons-schemas.ts'

const API_BASE = 'https://thesimpsonsapi.com/api'
const IMAGE_BASE = 'https://cdn.thesimpsonsapi.com/500'

/** API returns 20 items per page (fixed). */
export const SIMPSONS_PAGE_SIZE = 20

export type SimpsonsResource = 'episodes' | 'characters' | 'locations'

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
