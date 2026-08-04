import { describe, it, expect } from 'vitest'
import { sanitizeForSpeech, splitIntoSentences } from './speechText'

describe('sanitizeForSpeech', () => {
  it('expands MERN, CGPA, and AI into letter-by-letter speech', () => {
    expect(sanitizeForSpeech('I am a MERN developer with a CGPA of 3.2, focused on AI.')).toBe(
      'I am a M E R N developer with a C G P A of 3.2, focused on A I.'
    )
  })

  it('expands UI/UX before generic slash stripping', () => {
    expect(sanitizeForSpeech('Skilled in UI/UX design.')).toBe('Skilled in U I, U X design.')
  })

  it('does not mangle AI inside other words like API', () => {
    expect(sanitizeForSpeech('Built with the Gemini API.')).toBe('Built with the Gemini API.')
  })

  it('strips em dashes, bullets, and parentheses', () => {
    expect(sanitizeForSpeech('Full-stack — end to end (React, Node) • deployed')).toBe(
      'Full-stack , end to end React, Node deployed'
    )
  })

  it('strips generic slashes', () => {
    expect(sanitizeForSpeech('client/server model')).toBe('client server model')
  })
})

describe('splitIntoSentences', () => {
  it('splits on sentence-ending punctuation', () => {
    expect(splitIntoSentences('Hi there. I build apps! Do you like them?')).toEqual([
      'Hi there.',
      'I build apps!',
      'Do you like them?',
    ])
  })

  it('returns a single-element array for text with no terminal punctuation', () => {
    expect(splitIntoSentences('just one fragment')).toEqual(['just one fragment'])
  })

  it('ignores empty input', () => {
    expect(splitIntoSentences('')).toEqual([])
  })
})
