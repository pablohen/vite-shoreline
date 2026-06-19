import { Tag, Text } from '@vtex/shoreline'

export function textOrDash(value: string | undefined) {
	return <Text variant="body">{value || '—'}</Text>
}

export function blueTag(value: string) {
	return <Tag color="blue">{value}</Tag>
}
