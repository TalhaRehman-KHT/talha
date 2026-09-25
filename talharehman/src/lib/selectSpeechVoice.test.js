import { describe, it, expect } from 'vitest'
import { selectSpeechVoice } from './selectSpeechVoice'

function voice(name, lang = 'en-US') {
  return { name, lang }
}

// Roughly what Edge on Windows exposes — female neural voices come first.
const EDGE_VOICES = [
  voice('Microsoft Aria Online (Natural) - English (United States)'),
  voice('Microsoft Jenny Online (Natural) - English (United States)'),
  voice('Microsoft Guy Online (Natural) - English (United States)'),
  voice('Microsoft Andrew Online (Natural) - English (United States)'),
  voice('Microsoft Zira - English (United States)'),
  voice('Microsoft David - English (United States)'),
]

// Roughly what Chrome on Windows exposes.
const CHROME_VOICES = [
  voice('Microsoft David - English (United States)'),
  voice('Microsoft Zira - English (United States)'),
  voice('Google US English'),
  voice('Google UK English Female', 'en-GB'),
  voice('Google UK English Male', 'en-GB'),
]

describe('selectSpeechVoice', () => {
  it('picks a professional male neural voice on Edge instead of Aria/Jenny', () => {
    expect(selectSpeechVoice(EDGE_VOICES).name).toBe(
      'Microsoft Andrew Online (Natural) - English (United States)'
    )
  })

  it('picks Google UK English Male on Chrome instead of the female Google US English', () => {
    expect(selectSpeechVoice(CHROME_VOICES).name).toBe('Google UK English Male')
  })

  it('falls back to the Windows desktop male voice (David) over Zira', () => {
    const voices = [voice('Microsoft Zira - English (United States)'), voice('Microsoft David - English (United States)')]
    expect(selectSpeechVoice(voices).name).toBe('Microsoft David - English (United States)')
  })

  it('picks a male Apple voice (Daniel) on macOS/iOS over Samantha', () => {
    const voices = [voice('Samantha'), voice('Karen', 'en-AU'), voice('Daniel', 'en-GB')]
    expect(selectSpeechVoice(voices).name).toBe('Daniel')
  })

  it('treats any English voice named "Male" as male, but never "Female"', () => {
    const voices = [voice('Some Vendor Female'), voice('Some Vendor Male')]
    expect(selectSpeechVoice(voices).name).toBe('Some Vendor Male')
  })

  it('ignores male voices that are not English', () => {
    const voices = [voice('Microsoft Andrew Online (Natural)', 'fr-FR'), voice('Samantha')]
    expect(selectSpeechVoice(voices).name).toBe('Samantha')
  })

  it('with no male voice, prefers a non-female English voice over a known female one', () => {
    const voices = [voice('Google US English'), voice('English United States')]
    expect(selectSpeechVoice(voices).name).toBe('English United States')
  })

  it('still returns an English voice when every English voice is female', () => {
    const voices = [voice('Samantha')]
    expect(selectSpeechVoice(voices).name).toBe('Samantha')
  })

  it('returns null when nothing is English, leaving the browser default', () => {
    expect(selectSpeechVoice([voice('Thomas', 'fr-FR')])).toBeNull()
  })

  it('returns null for an empty voice list', () => {
    expect(selectSpeechVoice([])).toBeNull()
  })
})
