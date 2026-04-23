import { z } from 'zod'

export const SIMPSONS_TAB_IDS = ['episodes', 'characters', 'locations'] as const

export type SimpsonsTabId = (typeof SIMPSONS_TAB_IDS)[number]

export const simpsonsTabSchema = z
	.enum(SIMPSONS_TAB_IDS)
	.default('episodes')
	.catch('episodes')

export function isSimpsonsTabId(
	id: string | null | undefined,
): id is SimpsonsTabId {
	return id != null && (SIMPSONS_TAB_IDS as readonly string[]).includes(id)
}
