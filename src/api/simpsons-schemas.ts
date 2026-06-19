import { z } from 'zod'

export type PaginatedResponse<T> = {
	count: number
	pages: number
	results: T[]
}

const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
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

const appearanceRefSchema = z.object({
	id: z.number(),
	name: z.string(),
	airdate: z.string(),
	season: z.number(),
	episode_number: z.number(),
	synopsis: z.string(),
	image_path: z.string(),
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
	first_appearance_ep: appearanceRefSchema.nullable().optional(),
	first_appearance_sh: appearanceRefSchema.nullable().optional(),
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
	first_appearance_ep: appearanceRefSchema.nullable().optional(),
	first_appearance_sh: appearanceRefSchema.nullable().optional(),
})

export type AppearanceRef = z.infer<typeof appearanceRefSchema>

export type EpisodeListItem = z.infer<typeof episodeListItemSchema>
export type EpisodeDetail = z.infer<typeof episodeDetailSchema>
export type EpisodesListResponse = PaginatedResponse<EpisodeListItem>

export type CharacterListItem = z.infer<typeof characterListItemSchema>
export type CharacterDetail = z.infer<typeof characterDetailSchema>
export type CharactersListResponse = PaginatedResponse<CharacterListItem>

export type LocationListItem = z.infer<typeof locationListItemSchema>
export type LocationDetail = z.infer<typeof locationDetailSchema>
export type LocationsListResponse = PaginatedResponse<LocationListItem>

export const resourceSchemas = {
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
