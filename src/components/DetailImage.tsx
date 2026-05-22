import type { ImgHTMLAttributes } from 'react'

export type DetailImageProps = ImgHTMLAttributes<HTMLImageElement> & {
	alt: string
}

export function DetailImage({ style, alt, ...props }: DetailImageProps) {
	return (
		<img
			{...props}
			alt={alt}
			style={{
				width: '100%',
				height: 'auto',
				borderRadius: 'var(--sl-border-radius-2, 8px)',
				...style,
			}}
		/>
	)
}
