import { useCallback, useEffect, useRef, useState } from 'react'

interface AudioControls {
  supported: boolean
  isPlaying: boolean
  isPaused: boolean
  progress: number
  volume: number
  setVolume: (volume: number) => void
  play: () => void
  pause: () => void
  resume: () => void
  replay: () => void
  /** Jump to a position between 0 (start) and 1 (end). */
  seek: (fraction: number) => void
}

/**
 * Wraps a plain <audio> element behind the same control contract as
 * useSpeechSynthesis, so VoiceIntroPlayer's UI doesn't need to know which
 * playback path is active. `enabled` gates all effects — pass false until
 * the caller has confirmed the audio file actually exists.
 */
export function useAudioPlayer(src: string, enabled: boolean): AudioControls {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!enabled) return
    const audio = new Audio(src)
    audio.preload = 'auto'
    audioRef.current = audio

    const handleTimeUpdate = () => {
      if (audio.duration) setProgress(Math.min(1, audio.currentTime / audio.duration))
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(1)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audioRef.current = null
    }
  }, [enabled, src])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    void audioRef.current.play()
    setIsPlaying(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (!audioRef.current) return
    void audioRef.current.play()
    setIsPlaying(true)
    setIsPaused(false)
  }, [])

  const replay = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setProgress(0)
    void audioRef.current.play()
    setIsPlaying(true)
    setIsPaused(false)
  }, [])

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const clamped = Math.min(1, Math.max(0, fraction))
    audio.currentTime = clamped * audio.duration
    setProgress(clamped)
    // Not playing: park here so the primary button resumes instead of restarting.
    if (audio.paused) setIsPaused(true)
  }, [])

  const setVolume = useCallback((next: number) => setVolumeState(next), [])

  return { supported: enabled, isPlaying, isPaused, progress, volume, setVolume, play, pause, resume, replay, seek }
}
