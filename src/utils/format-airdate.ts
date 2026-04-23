export function formatAirdate(value: string): string {
	if (!value || value.trim() === '') {
		return '—'
	}
	return new Date(value).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	})
}
