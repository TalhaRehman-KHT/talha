import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  it('returns the current match state and updates on change', () => {
    let changeHandler: (event: { matches: boolean }) => void = () => {}
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_event: string, handler: typeof changeHandler) => { changeHandler = handler },
      removeEventListener: () => {},
    }))

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => changeHandler({ matches: true }))
    expect(result.current).toBe(true)
  })
})
