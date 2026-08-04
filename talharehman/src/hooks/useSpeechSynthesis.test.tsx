import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpeechSynthesis } from './useSpeechSynthesis'

class MockUtterance {
  text: string
  volume = 1
  rate = 1
  pitch = 1
  voice: unknown = null
  onend: (() => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

const SECTIONS = [
  { id: 'intro', text: 'Hi there. I build apps.' },
  { id: 'closing', text: 'Thanks for reading.' },
]

describe('useSpeechSynthesis', () => {
  let speakSpy: ReturnType<typeof vi.fn>
  let cancelSpy: ReturnType<typeof vi.fn>
  let pauseSpy: ReturnType<typeof vi.fn>
  let resumeSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    speakSpy = vi.fn()
    cancelSpy = vi.fn()
    pauseSpy = vi.fn()
    resumeSpy = vi.fn()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      speak: speakSpy,
      cancel: cancelSpy,
      pause: pauseSpy,
      resume: resumeSpy,
      getVoices: () => [],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reports supported: true when the API exists', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    expect(result.current.supported).toBe(true)
  })

  it('speaks the first sanitized sentence of the first section on play', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    expect(speakSpy).toHaveBeenCalledTimes(1)
    const utterance = speakSpy.mock.calls[0][0] as MockUtterance
    expect(utterance.text).toBe('Hi there.')
    expect(utterance.rate).toBe(0.92)
    expect(result.current.isPlaying).toBe(true)
  })

  it('queues the next sentence after a 350ms pause within the same section', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const first = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => first.onend?.())
    expect(speakSpy).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(349))
    expect(speakSpy).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(1))
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect((speakSpy.mock.calls[1][0] as MockUtterance).text).toBe('I build apps.')
  })

  it('waits 600ms between sections, longer than the 350ms sentence pause', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => (speakSpy.mock.calls[0][0] as MockUtterance).onend?.())
    act(() => vi.advanceTimersByTime(350))
    act(() => (speakSpy.mock.calls[1][0] as MockUtterance).onend?.())
    act(() => vi.advanceTimersByTime(350))
    expect(speakSpy).toHaveBeenCalledTimes(2)
    act(() => vi.advanceTimersByTime(250))
    expect(speakSpy).toHaveBeenCalledTimes(3)
    expect((speakSpy.mock.calls[2][0] as MockUtterance).text).toBe('Thanks for reading.')
  })

  it('finishes with progress 1 and isPlaying false after the last sentence', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => (speakSpy.mock.calls[0][0] as MockUtterance).onend?.())
    act(() => vi.advanceTimersByTime(350))
    act(() => (speakSpy.mock.calls[1][0] as MockUtterance).onend?.())
    act(() => vi.advanceTimersByTime(600))
    act(() => (speakSpy.mock.calls[2][0] as MockUtterance).onend?.())
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(1)
  })

  it('pause() stops speech and flips isPlaying/isPaused', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => result.current.pause())
    expect(pauseSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.isPaused).toBe(true)
  })

  it('resume() continues speech and flips isPlaying/isPaused back', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => result.current.pause())
    act(() => result.current.resume())
    expect(resumeSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.isPaused).toBe(false)
  })

  it('the 10s Chrome-bug interval does not call resume() while explicitly paused', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => result.current.pause())
    resumeSpy.mockClear()
    act(() => vi.advanceTimersByTime(10000))
    expect(resumeSpy).not.toHaveBeenCalled()
  })

  it('cancels and replays from the first sentence', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => result.current.replay())
    expect(cancelSpy).toHaveBeenCalled()
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect((speakSpy.mock.calls[1][0] as MockUtterance).text).toBe('Hi there.')
  })

  it('calls speechSynthesis.resume() every 10s while playing (Chrome bug workaround)', () => {
    renderHook(() => useSpeechSynthesis(SECTIONS)).result.current.play()
    act(() => vi.advanceTimersByTime(10000))
    expect(resumeSpy).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(10000))
    expect(resumeSpy).toHaveBeenCalledTimes(2)
  })

  it('cancels speech synthesis on unmount', () => {
    const { result, unmount } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    unmount()
    expect(cancelSpy).toHaveBeenCalled()
  })

  it('cancels speech when the tab becomes hidden', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    cancelSpy.mockClear()
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(cancelSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
  })
})
