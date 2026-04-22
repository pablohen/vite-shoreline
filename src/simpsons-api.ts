const API_BASE = 'https://thesimpsonsapi.com/api'
const IMAGE_BASE = 'https://cdn.thesimpsonsapi.com/500'

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

async function parseJson<T>(res: Response): Promise<T> {
	if (!res.ok) {
		throw new Error(`Request failed: ${res.status} ${res.statusText}`)
	}
	return res.json() as Promise<T>
}

export function episodeImageUrl(imagePath: string): string {
	if (imagePath.startsWith('http')) {
		return imagePath
	}
	return `${IMAGE_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

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
