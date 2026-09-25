// The Web Speech API doesn't expose a voice's gender, so voices are matched by
// name. Ordered best-first: calm, professional-sounding male voices.
const MALE_VOICE_NAMES = [
  // Edge / Windows 11 neural voices
  'Andrew',
  'Brian',
  'Guy',
  'Christopher',
  'Eric',
  'Roger',
  'Steffan',
  'Ryan',
  'Thomas',
  // Chrome
  'Google UK English Male',
  // Windows desktop voices
  'David',
  'Mark',
  'George',
  'James',
  // macOS / iOS
  'Daniel',
  'Alex',
  'Aaron',
  'Arthur',
  'Evan',
  'Nathan',
  'Oliver',
  'Tom',
  'Fred',
  'Rishi',
]

const FEMALE_VOICE_PATTERN =
  /female|aria|jenny|ava|emma|michelle|ana\b|sonia|libby|zira|hazel|susan|samantha|karen|moira|tessa|victoria|fiona|serena|google us english/i

const isEnglish = (voice) => /^en\b|^en[-_]/i.test(voice.lang)
const hasName = (voice, name) => new RegExp(`\\b${name}\\b`, 'i').test(voice.name)
const isNeural = (voice) => /natural|neural|online/i.test(voice.name)

/**
 * Picks a professional male English voice when the browser has one, falling
 * back to any English voice not known to be female, then any English voice.
 * Returns null when nothing is English, so callers keep the browser default.
 */
export function selectSpeechVoice(voices) {
  const english = voices.filter(isEnglish)
  if (english.length === 0) return null

  // Neural voices sound far more natural, so a neural male beats any other male.
  for (const preferNeural of [true, false]) {
    for (const name of MALE_VOICE_NAMES) {
      const found = english.find(
        (voice) => hasName(voice, name) && (!preferNeural || isNeural(voice)) && !FEMALE_VOICE_PATTERN.test(voice.name)
      )
      if (found) return found
    }
  }

  const namedMale = english.find((voice) => /\bmale\b/i.test(voice.name))
  if (namedMale) return namedMale

  return english.find((voice) => !FEMALE_VOICE_PATTERN.test(voice.name)) ?? english[0]
}
