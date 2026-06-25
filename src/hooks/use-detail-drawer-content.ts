import type {
	CharacterDetail,
	CharacterListItem,
	EpisodeDetail,
	EpisodeListItem,
	LocationDetail,
	LocationListItem,
} from '../simpsons-api.ts'
import { getErrorMessage } from '../utils/get-error-message.ts'
import { useSimpsonsDetailQueryImpl } from './use-simpsons-detail-query.ts'

type DetailDrawerContentResult<
	TDetail,
	TPreview extends { name: string } | null,
> = {
	data: TDetail | undefined
	display: TDetail | NonNullable<TPreview> | null | undefined
	title: string
	descriptionText: string | undefined
	errorMessage: string | null
	isPending: boolean
	hasContent: boolean
}

export function buildDetailDrawerContent<
	TDetail extends { name: string; description?: string },
	TPreview extends { name: string } | null,
>(
	data: TDetail | undefined,
	preview: TPreview,
	isPending: boolean,
	isError: boolean,
	error: Error | null,
	defaultTitle: string,
	errorLabel: string,
): DetailDrawerContentResult<TDetail, TPreview> {
	const display = data ?? preview
	const title = preview?.name ?? display?.name ?? defaultTitle
	const descriptionText = data?.description?.trim() || undefined
	const errorMessage = getErrorMessage(isError, error, errorLabel)

	return {
		data,
		display,
		title,
		descriptionText,
		errorMessage,
		isPending,
		hasContent: Boolean(display),
	}
}

export function useDetailDrawerContent(
	resource: 'episodes',
	id: number | null,
	preview: EpisodeListItem | null,
	defaultTitle: string,
	errorLabel: string,
): DetailDrawerContentResult<EpisodeDetail, EpisodeListItem | null>
export function useDetailDrawerContent(
	resource: 'characters',
	id: number | null,
	preview: CharacterListItem | null,
	defaultTitle: string,
	errorLabel: string,
): DetailDrawerContentResult<CharacterDetail, CharacterListItem | null>
export function useDetailDrawerContent(
	resource: 'locations',
	id: number | null,
	preview: LocationListItem | null,
	defaultTitle: string,
	errorLabel: string,
): DetailDrawerContentResult<LocationDetail, LocationListItem | null>
export function useDetailDrawerContent(
	resource: 'episodes' | 'characters' | 'locations',
	id: number | null,
	preview: EpisodeListItem | CharacterListItem | LocationListItem | null,
	defaultTitle: string,
	errorLabel: string,
) {
	const { data, isPending, isError, error } = useSimpsonsDetailQueryImpl(
		resource,
		id,
	)

	return buildDetailDrawerContent(
		data,
		preview,
		isPending,
		isError,
		error,
		defaultTitle,
		errorLabel,
	)
}
