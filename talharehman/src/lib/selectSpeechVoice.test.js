import { describe, it, expect } from 'vitest'
import { selectSpeechVoice } from './selectSpeechVoice'

function voice(name, lang = 'en-US') {
  return { name, lang }
}

describe('selectSpeechVoice', () => {
  it('prefers any voice whose name contains Natural', () => {
    const voices = [voice('Google US English'), voice('Microsoft Aria Online (Natural)')]
    expect(selectSpeechVoice(voices).name).toBe('Microsoft Aria Online (Natural)')
  })

  it('falls back to Google US/UK English when no Natural voice exists', () => {
    const voices = [voice('Fred'), voice('Google UK English Male')]
    expect(selectSpeechVoice(voices).name).toBe('Google UK English Male')
  })

  it('falls back to any en-US/en-GB voice next', () => {
    const voices = [voice('Fred', 'en-AU'), voice('Daniel', 'en-GB')]
    expect(selectSpeechVoice(voices).name).toBe('Daniel')
  })

  it('returns null when nothing matches, leaving the browser default', () => {
    const voices = [voice('Fred', 'fr-FR')]
    expect(selectSpeechVoice(voices)).toBeNull()
  })

  it('returns null for an empty voice list', () => {
    expect(selectSpeechVoice([])).toBeNull()
  })
})
