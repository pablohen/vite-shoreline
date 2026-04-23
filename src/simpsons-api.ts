const API_BASE = 'https://thesimpsonsapi.com/api'
const IMAGE_BASE = 'https://cdn.thesimpsonsapi.com/500'

/** API returns 20 items per page (fixed). */
export const SIMPSONS_PAGE_SIZE = 20

export type EpisodeListItem = {
	id: number
	name: string
	season: number
	episode_number: number
	airdate: string
	synopsis: string
	image_path: string
}

export type EpisodeDetail = EpisodeListItem & {
	description?: string
}

export type EpisodesListResponse = {
	count: number
	pages: number
	results: EpisodeListItem[]
}

export type CharacterListItem = {
	id: number
	name: string
	occupation: string
	gender: string
	status: string
	portrait_path: string
}

export type CharacterDetail = CharacterListItem & {
	description?: string
	age?: number
	birthdate?: string | null
	phrases?: string[]
	first_appearance_ep?: { id: number; name: string } | null
}

export type CharactersListResponse = {
	count: number
	pages: number
	results: CharacterListItem[]
}

export type LocationListItem = {
	id: number
	name: string
	town: string
	use: string
	image_path: string
}

export type LocationDetail = LocationListItem & {
	description?: string
}

export type LocationsListResponse = {
	count: number
	pages: number
	results: LocationListItem[]
}

async function parseJson<T>(res: Response): Promise<T> {
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`)
	}
	return res.json() as Promise<T>
}

/** Resolves CDN URLs for episode stills, character portraits, location images, etc. */
export function simpsonsImageUrl(imagePath: string): string {
	if (imagePath.startsWith('http')) {
		return imagePath
	}
	return `${IMAGE_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

/** @deprecated Use `simpsonsImageUrl` */
export const episodeImageUrl = simpsonsImageUrl

export async function fetchEpisodesPage(
	page: number,
): Promise<EpisodesListResponse> {
	const url = new URL(`${API_BASE}/episodes`)
	url.searchParams.set('page', String(page))
	const res = await fetch(url.toString())
	return parseJson<EpisodesListResponse>(res)
}

export async function fetchEpisodeById(id: number): Promise<EpisodeDetail> {
	const res = await fetch(`${API_BASE}/episodes/${id}`)
	return parseJson<EpisodeDetail>(res)
}

export async function fetchCharactersPage(
	page: number,
): Promise<CharactersListResponse> {
	const url = new URL(`${API_BASE}/characters`)
	url.searchParams.set('page', String(page))
	const res = await fetch(url.toString())
	return parseJson<CharactersListResponse>(res)
}

export async function fetchCharacterById(id: number): Promise<CharacterDetail> {
	const res = await fetch(`${API_BASE}/characters/${id}`)
	return parseJson<CharacterDetail>(res)
}

export async function fetchLocationsPage(
	page: number,
): Promise<LocationsListResponse> {
	const url = new URL(`${API_BASE}/locations`)
	url.searchParams.set('page', String(page))
	const res = await fetch(url.toString())
	return parseJson<LocationsListResponse>(res)
}

export async function fetchLocationById(id: number): Promise<LocationDetail> {
	const res = await fetch(`${API_BASE}/locations/${id}`)
	return parseJson<LocationDetail>(res)
}
