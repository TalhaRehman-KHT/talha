import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudioPlayer } from './useAudioPlayer'

describe('useAudioPlayer', () => {
  let playSpy: ReturnType<typeof vi.fn>
  let pauseSpy: ReturnType<typeof vi.fn>
  let instances: HTMLAudioElement[]
  let OriginalAudio: typeof Audio

  beforeEach(() => {
    playSpy = vi.fn().mockResolvedValue(undefined)
    pauseSpy = vi.fn()
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(playSpy)
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(pauseSpy)

    instances = []
    OriginalAudio = window.Audio
    class TrackedAudio extends OriginalAudio {
      constructor(...args: ConstructorParameters<typeof Audio>) {
        super(...args)
        instances.push(this)
      }
    }
    vi.stubGlobal('Audio', TrackedAudio)
  })

  afterEach(() => {
    vi.stubGlobal('Audio', OriginalAudio)
  })

  it('reports supported: false and does nothing when disabled', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', false))
    expect(result.current.supported).toBe(false)
    act(() => result.current.play())
    expect(playSpy).not.toHaveBeenCalled()
  })

  it('creates an audio element and plays when enabled', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', true))
    act(() => result.current.play())
    expect(playSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(true)
    expect(instances).toHaveLength(1)
    expect(instances[0].src).toContain('/audio/intro.mp3')
  })

  it('pause() calls pause and flips isPlaying/isPaused', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', true))
    act(() => result.current.play())
    act(() => result.current.pause())
    expect(pauseSpy).toHaveBeenCalled()
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.isPaused).toBe(true)
  })

  it('resume() plays again and flips isPlaying/isPaused back', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', true))
    act(() => result.current.play())
    act(() => result.current.pause())
    act(() => result.current.resume())
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.isPaused).toBe(false)
  })

  it('tracks progress from timeupdate and completes on ended', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', true))
    act(() => result.current.play())
    const audio = instances[0]
    Object.defineProperty(audio, 'duration', { value: 10, configurable: true })
    Object.defineProperty(audio, 'currentTime', { value: 5, configurable: true })
    act(() => audio.dispatchEvent(new Event('timeupdate')))
    expect(result.current.progress).toBeCloseTo(0.5)

    act(() => audio.dispatchEvent(new Event('ended')))
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.progress).toBe(1)
  })

  it('replay() resets currentTime to 0 and plays from the start', () => {
    const { result } = renderHook(() => useAudioPlayer('/audio/intro.mp3', true))
    act(() => result.current.play())
    const audio = instances[0]
    Object.defineProperty(audio, 'currentTime', { value: 7, writable: true, configurable: true })
    act(() => result.current.replay())
    expect(audio.currentTime).toBe(0)
    expect(result.current.progress).toBe(0)
  })
})
