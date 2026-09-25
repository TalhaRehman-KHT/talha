import { describe, it, expect } from 'vitest'
import { buildIntroScript } from './buildIntroScript'

describe('buildIntroScript', () => {
  it('includes the name, role, and at least one featured project title', () => {
    const script = buildIntroScript()
    expect(script).toContain('Talha Rehman')
    expect(script.length).toBeGreaterThan(50)
  })

  it('uses the updated professional introduction', () => {
    const script = buildIntroScript()
    expect(script).toMatch(/^Hi, I'm Talha Rehman, a Full-Stack Software Engineer based in Islamabad, Pakistan\./)
    expect(script).toContain('Retrieval-Augmented Generation')
    expect(script).toContain('OpenAI APIs, Ollama models, and the Anthropic API')
    expect(script).toMatch(/Let's build something great together\.$/)
    // No stray quote characters from the pasted draft.
    expect(script).not.toMatch(/["“”]/)
  })
})
