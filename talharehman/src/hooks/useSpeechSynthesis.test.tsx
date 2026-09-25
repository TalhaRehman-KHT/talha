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
  onerror: ((event: { error: string }) => void) | null = null
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
    vi.restoreAllMocks()
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
    cancelSpy.mockClear()
    act(() => result.current.pause())
    // cancel() is used instead of speechSynthesis.pause(), which Chrome's
    // Google voices ignore or never resume from.
    expect(cancelSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.isPaused).toBe(true)
  })

  it('resume() re-speaks the interrupted sentence and flips isPlaying/isPaused back', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => result.current.pause())
    act(() => result.current.resume())
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect((speakSpy.mock.calls[1][0] as MockUtterance).text).toBe('Hi there.')
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.isPaused).toBe(false)
  })

  it('pausing in the gap between sentences does not start the next sentence', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => (speakSpy.mock.calls[0][0] as MockUtterance).onend?.())
    act(() => result.current.pause())
    act(() => vi.advanceTimersByTime(1000))
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(result.current.isPaused).toBe(true)
  })

  it('resuming after a gap pause continues with the next sentence, not the finished one', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    act(() => (speakSpy.mock.calls[0][0] as MockUtterance).onend?.())
    act(() => result.current.pause())
    act(() => result.current.resume())
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect((speakSpy.mock.calls[1][0] as MockUtterance).text).toBe('I build apps.')
  })

  it('ignores the late onend that cancel() fires on the interrupted utterance', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const interrupted = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => result.current.pause())
    // Some browsers fire onend for a cancelled utterance.
    act(() => interrupted.onend?.())
    act(() => vi.advanceTimersByTime(1000))
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(result.current.progress).toBe(0)
  })

  it('replay does not let the previous run keep speaking in parallel', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const oldRun = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => result.current.replay())
    act(() => oldRun.onend?.())
    act(() => vi.advanceTimersByTime(1000))
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect(result.current.progress).toBe(0)
  })

  it('pause() while nothing is playing is a no-op', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.pause())
    expect(result.current.isPaused).toBe(false)
  })

  it('stops (instead of hanging on "playing") when an utterance fails', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const utterance = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => utterance.onerror?.({ error: 'synthesis-failed' }))
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.isPaused).toBe(false)
  })

  it('treats an "interrupted" error from its own cancel() as expected, not a failure', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const utterance = speakSpy.mock.calls[0][0] as MockUtterance
    act(() => result.current.pause())
    act(() => utterance.onerror?.({ error: 'interrupted' }))
    expect(result.current.isPaused).toBe(true)
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

  describe('seek()', () => {
    // SECTIONS has 3 sentences: 'Hi there.', 'I build apps.', 'Thanks for reading.'
    const lastSpoken = () => (speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0] as MockUtterance).text

    it('jumps forward while playing and keeps playing from that sentence', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      cancelSpy.mockClear()
      act(() => result.current.seek(0.7))
      expect(cancelSpy).toHaveBeenCalled()
      expect(lastSpoken()).toBe('Thanks for reading.')
      expect(result.current.progress).toBeCloseTo(2 / 3)
      expect(result.current.isPlaying).toBe(true)
    })

    it('jumps backward while playing', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.seek(0.7))
      act(() => result.current.seek(0))
      expect(lastSpoken()).toBe('Hi there.')
      expect(result.current.progress).toBe(0)
    })

    it('continues on to the following sentence after a seek', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.seek(0.4))
      expect(lastSpoken()).toBe('I build apps.')
      const seekedTo = speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0] as MockUtterance
      act(() => seekedTo.onend?.())
      act(() => vi.advanceTimersByTime(600))
      expect(lastSpoken()).toBe('Thanks for reading.')
    })

    it('ignores the old sentence finishing after a seek', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      const old = speakSpy.mock.calls[0][0] as MockUtterance
      act(() => result.current.seek(0.7))
      const callsAfterSeek = speakSpy.mock.calls.length
      act(() => old.onend?.())
      act(() => vi.advanceTimersByTime(1000))
      expect(speakSpy).toHaveBeenCalledTimes(callsAfterSeek)
      expect(result.current.progress).toBeCloseTo(2 / 3)
    })

    it('does not restart the current sentence when dragging within it', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.seek(0.1))
      expect(speakSpy).toHaveBeenCalledTimes(1)
    })

    it('while paused, moves the position silently and resume() starts there', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.pause())
      const calls = speakSpy.mock.calls.length
      act(() => result.current.seek(0.7))
      expect(speakSpy).toHaveBeenCalledTimes(calls)
      expect(result.current.progress).toBeCloseTo(2 / 3)
      expect(result.current.isPaused).toBe(true)
      act(() => result.current.resume())
      expect(lastSpoken()).toBe('Thanks for reading.')
    })

    it('before playing, sets a start position that resume() plays from', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.seek(0.4))
      expect(speakSpy).not.toHaveBeenCalled()
      expect(result.current.isPaused).toBe(true)
      act(() => result.current.resume())
      expect(lastSpoken()).toBe('I build apps.')
    })

    it('after finishing, dragging back lets you listen again from there', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.seek(1))
      act(() => (speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0] as MockUtterance).onend?.())
      expect(result.current.progress).toBe(1)
      act(() => result.current.seek(0.4))
      expect(result.current.isPaused).toBe(true)
      act(() => result.current.resume())
      expect(lastSpoken()).toBe('I build apps.')
    })

    it('clamps out-of-range positions to the first/last sentence', () => {
      const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
      act(() => result.current.play())
      act(() => result.current.seek(5))
      expect(lastSpoken()).toBe('Thanks for reading.')
      act(() => result.current.seek(-1))
      expect(lastSpoken()).toBe('Hi there.')
    })
  })

  it('does not continue speaking after the tab is hidden', () => {
    const { result } = renderHook(() => useSpeechSynthesis(SECTIONS))
    act(() => result.current.play())
    const cancelled = speakSpy.mock.calls[0][0] as MockUtterance
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    act(() => cancelled.onend?.())
    act(() => vi.advanceTimersByTime(1000))
    expect(speakSpy).toHaveBeenCalledTimes(1)
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
