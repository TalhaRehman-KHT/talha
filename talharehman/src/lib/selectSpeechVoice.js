const PRIORITY_TIERS = [
  (voice) => voice.name.includes('Natural'),
  (voice) => voice.name.includes('Google US English') || voice.name.includes('Google UK English Male'),
  (voice) => voice.name.includes('Microsoft') && voice.name.includes('Natural'),
  (voice) => /en-US|en-GB/i.test(voice.lang),
]

/**
 * Picks the most natural-sounding available voice. Returns null when nothing
 * matches, so callers leave the browser's own default voice in place.
 */
export function selectSpeechVoice(voices) {
  for (const matchesTier of PRIORITY_TIERS) {
    const found = voices.find(matchesTier)
    if (found) return found
  }
  return null
}
