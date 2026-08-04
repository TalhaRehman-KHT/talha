import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpeechSynthesis } from './useSpeechSynthesis'

class MockUtterance {
  text: string
  volume = 1
  rate = 1
  onboundary: ((event: { charIndex: number }) => void) | null = null
  onend: (() => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

describe('useSpeechSynthesis', () => {
  let speakSpy: ReturnType<typeof vi.fn>
  let cancelSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    speakSpy = vi.fn()
    cancelSpy = vi.fn()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      speak: speakSpy,
      cancel: cancelSpy,
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: () => [],
    })
  })

  it('reports supported: true when the API exists', () => {
    const { result } = renderHook(() => useSpeechSynthesis('Hello there'))
    expect(result.current.supported).toBe(true)
  })

  it('calls speechSynthesis.speak on play and sets isPlaying', () => {
    const { result } = renderHook(() => useSpeechSynthesis('Hello there'))
    act(() => result.current.play())
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(result.current.isPlaying).toBe(true)
  })

  it('updates progress from boundary events', () => {
    const { result } = renderHook(() => useSpeechSynthesis('Hello there'))
    act(() => result.current.play())
    const utterance = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => utterance.onboundary?.({ charIndex: 5 }))
    expect(result.current.progress).toBeCloseTo(5 / 'Hello there'.length, 2)
  })

  it('resets isPlaying when the utterance ends', () => {
    const { result } = renderHook(() => useSpeechSynthesis('Hello there'))
    act(() => result.current.play())
    const utterance = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => utterance.onend?.())
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(1)
  })

  it('cancels and replays from the start', () => {
    const { result } = renderHook(() => useSpeechSynthesis('Hello there'))
    act(() => result.current.play())
    act(() => result.current.replay())
    expect(cancelSpy).toHaveBeenCalled()
    expect(speakSpy).toHaveBeenCalledTimes(2)
  })
})
