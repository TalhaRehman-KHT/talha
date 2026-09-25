const ABBREVIATIONS = [
  [/\bUI\/UX\b/gi, 'U I, U X'],
  [/\bMERN\b/g, 'M E R N'],
  [/\bPERN\b/g, 'P E R N'],
  [/\bCGPA\b/g, 'C G P A'],
  [/\bAI\b/g, 'A I'],
  [/\bOpenAI\b/g, 'Open A I'],
  [/\bLLMs?\b/g, (match) => (match.endsWith('s') ? 'L L Ms' : 'L L M')],
  [/\bERP\b/g, 'E R P'],
  [/\bn8n\b/gi, 'n eight n'],
  [/\.js\b/g, ' J S'],
]

/**
 * Rewrites text for TTS: expands abbreviations into letter-by-letter speech
 * and strips characters that read poorly (em/en dashes, bullets, parens, slashes).
 * Never mutates the source — callers keep the original for display.
 */
export function sanitizeForSpeech(text) {
  let result = text
  for (const [pattern, replacement] of ABBREVIATIONS) {
    result = result.replace(pattern, replacement)
  }
  return result
    .replace(/[—–]/g, ', ')
    .replace(/[•·]/g, '')
    .replace(/[()]/g, '')
    .replace(/\//g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Splits prose into sentences for sentence-by-sentence TTS queueing. */
export function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}
