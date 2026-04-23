export function getErrorMessage(
	isError: boolean,
	error: unknown,
	fallback: string,
): string | null {
	if (!isError) {
		return null
	}
	if (error instanceof Error) {
		return error.message
	}
	return fallback
}
