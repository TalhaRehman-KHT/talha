import { useCallback, useEffect, useRef, useState } from 'react'
import { sanitizeForSpeech, splitIntoSentences } from '../lib/speechText'
import { selectSpeechVoice } from '../lib/selectSpeechVoice'

export interface NarrationSection {
  id: string
  text: string
}

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

interface QueueItem {
  text: string
  pauseAfterMs: number
}

const SENTENCE_PAUSE_MS = 350
const SECTION_PAUSE_MS = 600
const CHROME_RESUME_INTERVAL_MS = 10000

function buildQueue(sections: NarrationSection[]): QueueItem[] {
  const queue: QueueItem[] = []
  sections.forEach((section, sectionIndex) => {
    const sentences = splitIntoSentences(section.text)
    sentences.forEach((sentence, sentenceIndex) => {
      const isLastSentenceInSection = sentenceIndex === sentences.length - 1
      const isLastSection = sectionIndex === sections.length - 1
      queue.push({
        text: sanitizeForSpeech(sentence),
        pauseAfterMs: isLastSentenceInSection ? (isLastSection ? 0 : SECTION_PAUSE_MS) : SENTENCE_PAUSE_MS,
      })
    })
  })
  return queue
}

export function useSpeechSynthesis(sections: NarrationSection[]): SpeechControls {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolumeState] = useState(1)

  const queueRef = useRef<QueueItem[]>(buildQueue(sections))
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const volumeRef = useRef(1)
  const isPlayingRef = useRef(false)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    queueRef.current = buildQueue(sections)
  }, [sections])

  useEffect(() => {
    if (!supported) return

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) voiceRef.current = selectSpeechVoice(voices)
    }

    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [supported])

  const clearResumeInterval = useCallback(() => {
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current)
      resumeIntervalRef.current = null
    }
  }, [])

  const clearPauseTimeout = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }
  }, [])

  const speakIndex = useCallback(
    (index: number) => {
      const queue = queueRef.current
      const item = queue[index]
      if (!item) {
        isPlayingRef.current = false
        setIsPlaying(false)
        setIsPaused(false)
        setProgress(1)
        clearResumeInterval()
        return
      }

      const utterance = new SpeechSynthesisUtterance(item.text)
      utterance.rate = 0.92
      utterance.pitch = 1.0
      utterance.volume = volumeRef.current
      if (voiceRef.current) utterance.voice = voiceRef.current

      utterance.onend = () => {
        const completed = index + 1
        setProgress(Math.min(1, completed / queue.length))
        if (completed >= queue.length) {
          isPlayingRef.current = false
          setIsPlaying(false)
          setIsPaused(false)
          setProgress(1)
          clearResumeInterval()
          return
        }
        pauseTimeoutRef.current = setTimeout(() => speakIndex(completed), item.pauseAfterMs)
      }

      window.speechSynthesis.speak(utterance)
    },
    [clearResumeInterval]
  )

  const play = useCallback(() => {
    if (!supported || queueRef.current.length === 0) return
    clearPauseTimeout()
    window.speechSynthesis.cancel()
    setProgress(0)
    isPlayingRef.current = true
    setIsPlaying(true)
    setIsPaused(false)
    speakIndex(0)

    clearResumeInterval()
    resumeIntervalRef.current = setInterval(() => {
      // Chrome silently stops speech after ~15s on long utterances; nudging
      // resume() keeps it going. Guarded so it never fights an explicit pause.
      if (isPlayingRef.current) window.speechSynthesis.resume()
    }, CHROME_RESUME_INTERVAL_MS)
  }, [supported, speakIndex, clearPauseTimeout, clearResumeInterval])

  const pause = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.pause()
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsPaused(true)
  }, [supported])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    isPlayingRef.current = true
    setIsPlaying(true)
    setIsPaused(false)
  }, [supported])

  const replay = useCallback(() => {
    if (!supported) return
    clearPauseTimeout()
    window.speechSynthesis.cancel()
    setProgress(0)
    play()
  }, [supported, play, clearPauseTimeout])

  const setVolume = useCallback((next: number) => {
    volumeRef.current = next
    setVolumeState(next)
  }, [])

  useEffect(() => {
    return () => {
      clearPauseTimeout()
      clearResumeInterval()
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported, clearPauseTimeout, clearResumeInterval])

  useEffect(() => {
    if (!supported) return
    function handleVisibilityChange() {
      if (document.visibilityState !== 'hidden') return
      clearPauseTimeout()
      clearResumeInterval()
      window.speechSynthesis.cancel()
      isPlayingRef.current = false
      setIsPlaying(false)
      setIsPaused(false)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [supported, clearPauseTimeout, clearResumeInterval])

  return { supported, isPlaying, isPaused, progress, volume, setVolume, play, pause, resume, replay }
}
