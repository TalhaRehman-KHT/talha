import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

function Probe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('ThemeProvider / useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('dark'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  it('defaults to the system preference when nothing is stored', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('uses the stored preference over system preference', () => {
    localStorage.setItem('portfolio-theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('toggles and persists the new theme', () => {
    localStorage.setItem('portfolio-theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
