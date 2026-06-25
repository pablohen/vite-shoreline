// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
	ClampedSynopsis,
	getSynopsisText,
	shouldShowSynopsisTooltip,
} from './ClampedSynopsis.tsx'

describe('getSynopsisText', () => {
	it('trims text and returns undefined for empty values', () => {
		expect(getSynopsisText('  hello  ')).toBe('hello')
		expect(getSynopsisText('   ')).toBeUndefined()
		expect(getSynopsisText(undefined)).toBeUndefined()
	})
})

describe('shouldShowSynopsisTooltip', () => {
	it('returns true when text exceeds threshold', () => {
		expect(shouldShowSynopsisTooltip('a'.repeat(121), 120)).toBe(true)
	})

	it('returns false for short or missing text', () => {
		expect(shouldShowSynopsisTooltip('short', 120)).toBe(false)
		expect(shouldShowSynopsisTooltip(undefined, 120)).toBe(false)
	})
})

describe('ClampedSynopsis', () => {
	it('renders short text without a tooltip', () => {
		render(<ClampedSynopsis text="Short synopsis" />)

		expect(screen.getByText('Short synopsis')).toBeTruthy()
		expect(screen.queryByRole('tooltip')).toBeNull()
	})

	it('renders em dash for empty text', () => {
		render(<ClampedSynopsis text="   " />)

		expect(screen.getByText('—')).toBeTruthy()
	})

	it('renders long text with tooltip wrapper', () => {
		const longSynopsis = 'a'.repeat(121)
		const { container } = render(<ClampedSynopsis text={longSynopsis} />)

		expect(container.querySelector('[data-sl-tooltip]')).toBeTruthy()
		expect(screen.getAllByText(longSynopsis).length).toBeGreaterThan(0)
	})
})
