import { useEffect, useState } from 'react'

export const MOBILE_NAV_MEDIA_QUERY = '(max-width: 47.99rem)'

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(query)
		setMatches(media.matches)

		function onChange(event: MediaQueryListEvent) {
			setMatches(event.matches)
		}

		media.addEventListener('change', onChange)
		return () => media.removeEventListener('change', onChange)
	}, [query])

	return matches
}

export function useIsMobileNav(): boolean {
	return useMediaQuery(MOBILE_NAV_MEDIA_QUERY)
}
