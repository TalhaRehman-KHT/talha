import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeechControls {
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
}

export function useSpeechSynthesis(text: string): SpeechControls {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const buildUtterance = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.volume = volume
    utterance.onboundary = (event) => {
      setProgress(Math.min(1, event.charIndex / text.length))
    }
    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(1)
    }
    utteranceRef.current = utterance
    return utterance
  }, [text, volume])

  const play = useCallback(() => {
    if (!supported) return
    const utterance = buildUtterance()
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }, [supported, buildUtterance])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    setIsPaused(true)
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    setIsPaused(false)
  }, [supported])

  const replay = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setProgress(0)
    play()
  }, [supported, play])

  const setVolume = useCallback((next: number) => {
    setVolumeState(next)
    if (utteranceRef.current) utteranceRef.current.volume = next
  }, [])

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  return { supported, isPlaying, isPaused, progress, volume, setVolume, play, pause, resume, replay }
}
