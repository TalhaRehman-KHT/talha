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
  /** Jump to a position between 0 (start) and 1 (end). */
  seek: (fraction: number) => void
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
  // Bumped whenever speech is stopped. Utterance callbacks capture the value at
  // speak time and ignore themselves if it has changed, because cancel() still
  // fires onend/onerror on the utterance it interrupted.
  const runIdRef = useRef(0)
  // Sentence to (re)start from on resume.
  const currentIndexRef = useRef(0)

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

  const startResumeInterval = useCallback(() => {
    clearResumeInterval()
    resumeIntervalRef.current = setInterval(() => {
      // Chrome silently stops speech after ~15s on long utterances; nudging
      // resume() keeps it going. Guarded so it never fights an explicit pause.
      if (isPlayingRef.current) window.speechSynthesis.resume()
    }, CHROME_RESUME_INTERVAL_MS)
  }, [clearResumeInterval])

  // Silences the engine and invalidates every callback of the current run.
  const stopSpeech = useCallback(() => {
    runIdRef.current += 1
    clearPauseTimeout()
    clearResumeInterval()
    window.speechSynthesis.cancel()
  }, [clearPauseTimeout, clearResumeInterval])

  const finish = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(1)
    clearResumeInterval()
  }, [clearResumeInterval])

  const speakIndex = useCallback(
    (index: number) => {
      const runId = runIdRef.current
      const queue = queueRef.current
      const item = queue[index]
      currentIndexRef.current = index
      if (!item) {
        finish()
        return
      }

      const utterance = new SpeechSynthesisUtterance(item.text)
      utterance.rate = 0.92
      utterance.pitch = 1.0
      utterance.volume = volumeRef.current
      if (voiceRef.current) utterance.voice = voiceRef.current

      utterance.onend = () => {
        if (runId !== runIdRef.current) return
        const completed = index + 1
        currentIndexRef.current = completed
        setProgress(Math.min(1, completed / queue.length))
        if (completed >= queue.length) {
          finish()
          return
        }
        pauseTimeoutRef.current = setTimeout(() => speakIndex(completed), item.pauseAfterMs)
      }

      utterance.onerror = (event) => {
        if (runId !== runIdRef.current) return
        if (event.error === 'interrupted' || event.error === 'canceled') return
        // A real failure (e.g. synthesis-failed): stop instead of leaving the
        // button stuck on "Pause" with nothing playing.
        stopSpeech()
        isPlayingRef.current = false
        setIsPlaying(false)
        setIsPaused(false)
      }

      window.speechSynthesis.speak(utterance)
    },
    [finish, stopSpeech]
  )

  const play = useCallback(() => {
    if (!supported || queueRef.current.length === 0) return
    stopSpeech()
    setProgress(0)
    isPlayingRef.current = true
    setIsPlaying(true)
    setIsPaused(false)
    startResumeInterval()
    speakIndex(0)
  }, [supported, speakIndex, stopSpeech, startResumeInterval])

  // Pause cancels rather than calling speechSynthesis.pause(): Chrome's Google
  // voices ignore pause() or never come back from resume(), and a pause() that
  // lands in the gap between sentences can't stop the timer for the next one.
  // Resume re-speaks the interrupted sentence from its start.
  const pause = useCallback(() => {
    if (!supported || !isPlayingRef.current) return
    stopSpeech()
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsPaused(true)
  }, [supported, stopSpeech])

  const resume = useCallback(() => {
    if (!supported || isPlayingRef.current) return
    isPlayingRef.current = true
    setIsPlaying(true)
    setIsPaused(false)
    startResumeInterval()
    speakIndex(currentIndexRef.current)
  }, [supported, speakIndex, startResumeInterval])

  const replay = useCallback(() => {
    if (!supported) return
    play()
  }, [supported, play])

  // Speech can't start mid-sentence, so seeking snaps to the start of the
  // sentence under `fraction`. While playing it jumps straight there;
  // otherwise it just moves the position and leaves the player paused, so the
  // next resume() starts from it.
  const seek = useCallback(
    (fraction: number) => {
      const total = queueRef.current.length
      if (!supported || total === 0) return
      const index = Math.min(total - 1, Math.max(0, Math.floor(fraction * total)))

      if (isPlayingRef.current) {
        if (index === currentIndexRef.current) return
        stopSpeech()
        setProgress(index / total)
        startResumeInterval()
        speakIndex(index)
        return
      }

      currentIndexRef.current = index
      setProgress(index / total)
      setIsPaused(true)
    },
    [supported, speakIndex, stopSpeech, startResumeInterval]
  )

  const setVolume = useCallback((next: number) => {
    volumeRef.current = next
    setVolumeState(next)
  }, [])

  useEffect(() => {
    return () => {
      if (supported) stopSpeech()
    }
  }, [supported, stopSpeech])

  useEffect(() => {
    if (!supported) return
    function handleVisibilityChange() {
      if (document.visibilityState !== 'hidden') return
      stopSpeech()
      isPlayingRef.current = false
      setIsPlaying(false)
      setIsPaused(false)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [supported, stopSpeech])

  return { supported, isPlaying, isPaused, progress, volume, setVolume, play, pause, resume, replay, seek }
}
