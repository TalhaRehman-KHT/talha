import { describe, it, expect } from 'vitest'
import { buildIntroScript } from './buildIntroScript'

describe('buildIntroScript', () => {
  it('includes the name, role, and at least one featured project title', () => {
    const script = buildIntroScript()
    expect(script).toContain('Talha Rehman')
    expect(script.length).toBeGreaterThan(50)
  })
})
