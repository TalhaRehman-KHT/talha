import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTypingEffect } from './useTypingEffect'

describe('useTypingEffect', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('types out the first string one character at a time', () => {
    const { result } = renderHook(() => useTypingEffect(['Hi'], { typingSpeedMs: 10 }))
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('H')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('Hi')
  })

  it('returns the full static string immediately when reduceMotion is true', () => {
    const { result } = renderHook(() => useTypingEffect(['Hi', 'There'], { reduceMotion: true }))
    expect(result.current).toBe('Hi')
  })
})
