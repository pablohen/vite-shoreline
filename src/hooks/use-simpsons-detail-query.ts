import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
	type CharacterDetail,
	type EpisodeDetail,
	fetchById,
	type LocationDetail,
	type SimpsonsResource,
} from '../simpsons-api.ts'

function useSimpsonsDetailQueryImpl(
	resource: SimpsonsResource,
	id: number | null,
): UseQueryResult<EpisodeDetail | CharacterDetail | LocationDetail> {
	return useQuery<
		EpisodeDetail | CharacterDetail | LocationDetail,
		Error,
		EpisodeDetail | CharacterDetail | LocationDetail,
		readonly [SimpsonsResource, 'detail', number | null]
	>({
		queryKey: [resource, 'detail', id] as const,
		queryFn: () => {
			if (id == null) {
				throw new Error(`No ${resource.slice(0, -1)} id`)
			}

			switch (resource) {
				case 'episodes':
					return fetchById('episodes', id)
				case 'characters':
					return fetchById('characters', id)
				case 'locations':
					return fetchById('locations', id)
			}
		},
		enabled: id != null,
	})
}

export function useSimpsonsDetailQuery(
	resource: 'episodes',
	id: number | null,
): UseQueryResult<EpisodeDetail>
export function useSimpsonsDetailQuery(
	resource: 'characters',
	id: number | null,
): UseQueryResult<CharacterDetail>
export function useSimpsonsDetailQuery(
	resource: 'locations',
	id: number | null,
): UseQueryResult<LocationDetail>
export function useSimpsonsDetailQuery(
	resource: SimpsonsResource,
	id: number | null,
): UseQueryResult<EpisodeDetail | CharacterDetail | LocationDetail> {
	return useSimpsonsDetailQueryImpl(resource, id)
}

export { useSimpsonsDetailQueryImpl }
