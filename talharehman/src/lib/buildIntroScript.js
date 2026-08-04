import narration from '../data/narration.json'

/** The structured narration sections, used for sentence/section-paced playback. */
export function getNarrationSections() {
  return narration
}

/** The full narration as one string, for display or non-paced fallback use. */
export function buildIntroScript() {
  return narration.map((section) => section.text).join(' ')
}
