import { z } from 'zod'
import { type SimpsonsTabId, simpsonsTabSchema } from './simpsons-tabs.ts'

export const defaultSearchValues = {
	page: 1,
	tab: 'episodes' as const satisfies SimpsonsTabId,
}

export const searchSchema = z.object({
	page: z.coerce.number().int().min(1).default(1).catch(1),
	tab: simpsonsTabSchema,
	detail: z.coerce.number().int().positive().optional().catch(undefined),
})

export type AppSearch = z.infer<typeof searchSchema>
