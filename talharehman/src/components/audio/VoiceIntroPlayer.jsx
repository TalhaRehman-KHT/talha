import { useState } from 'react'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { buildIntroScript } from '../../lib/buildIntroScript'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { GlassCard } from '../ui/GlassCard'

const SCRIPT = buildIntroScript()

// No pre-recorded intro.mp3 ships with this repo (none was supplied — see MIGRATION_PLAN.md
// "Known unknowns"). This path only renders for browsers without the Web Speech API, and
// degrades to an explanatory message if the file is genuinely absent.
const AUDIO_FALLBACK_SRC = '/audio/intro.mp3'

function AudioFallbackPlayer() {
  const [unavailable, setUnavailable] = useState(false)

  if (unavailable) {
    return (
      <GlassCard className="mx-auto max-w-md p-4 text-center text-sm text-white/50">
        Voice introduction isn&apos;t available in this browser, and no recorded fallback has
        been added yet.
      </GlassCard>
    )
  }

  return (
    <GlassCard className="mx-auto flex max-w-md flex-col gap-2 p-4">
      <p className="text-xs text-white/50">
        Play Introduction — a short spoken intro about my background (recorded audio fallback).
      </p>
      <audio
        controls
        preload="none"
        src={AUDIO_FALLBACK_SRC}
        onError={() => setUnavailable(true)}
        aria-label="Play recorded introduction"
        className="w-full"
      >
        Your browser does not support the audio element.
      </audio>
    </GlassCard>
  )
}

export function VoiceIntroPlayer() {
  const { supported, isPlaying, isPaused, progress, volume, setVolume, play, pause, resume, replay } =
    useSpeechSynthesis(SCRIPT)

  if (!supported) {
    return <AudioFallbackPlayer />
  }

  function handlePrimaryAction() {
    if (!isPlaying && !isPaused) return play()
    if (isPlaying) return pause()
    return resume()
  }

  return (
    <GlassCard className="mx-auto flex max-w-md flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrimaryAction}
          aria-label={isPlaying ? 'Pause introduction' : 'Play introduction'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-aurora-violet to-aurora-cyan text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
        <button
          onClick={replay}
          aria-label="Replay introduction"
          className="rounded text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan"
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>

        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Introduction playback progress"
        >
          <div className="h-full rounded-full bg-aurora-cyan" style={{ width: `${progress * 100}%` }} />
        </div>

        <Volume2 size={16} className="text-white/60" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
          className="w-16"
        />
      </div>
      <p className="text-xs text-white/50">Play Introduction — a short spoken intro about my background.</p>
    </GlassCard>
  )
}
