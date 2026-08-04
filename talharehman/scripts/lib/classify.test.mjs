import { describe, it, expect } from 'vitest'
import { isExcludedRepo, classifyCategory, classifyStatus, toProjectEntry } from './classify.mjs'

const baseRepo = {
  name: 'SHOP-IT',
  description: 'Ecommerce platform for B2B sellers',
  language: 'JavaScript',
  fork: false,
  archived: false,
  stargazers_count: 1,
  html_url: 'https://github.com/TalhaRehman-KHT/SHOP-IT',
  homepage: 'https://shop-it-orpin.vercel.app',
  size: 753,
  updated_at: '2025-03-08T00:00:00Z',
}

describe('isExcludedRepo', () => {
  it('excludes forks', () => {
    expect(isExcludedRepo({ ...baseRepo, fork: true })).toBe(true)
  })

  it('excludes archived repos', () => {
    expect(isExcludedRepo({ ...baseRepo, archived: true })).toBe(true)
  })

  it('excludes tutorial/coursework-named repos', () => {
    for (const name of ['TODO-APP-', 'AssignmentProject', 'CRUD-with-SUPABASE', 'TaskApp', 'DecodeLabs-Internship.']) {
      expect(isExcludedRepo({ ...baseRepo, name, description: null, homepage: null, size: 10 })).toBe(true)
    }
  })

  it('excludes repos with no description, no homepage, and small size', () => {
    expect(isExcludedRepo({ ...baseRepo, name: 'scratch', description: null, homepage: null, size: 5 })).toBe(true)
  })

  it('keeps real, described, deployed repos', () => {
    expect(isExcludedRepo(baseRepo)).toBe(false)
  })

  it('keeps large repos even without a description, as long as a homepage exists', () => {
    expect(isExcludedRepo({ ...baseRepo, name: 'GreenSoq', description: null, homepage: 'https://green-soq.vercel.app', size: 4247 })).toBe(false)
  })

  it('excludes repos with no description and no homepage regardless of size', () => {
    expect(isExcludedRepo({ ...baseRepo, name: 'Secrets', description: '', homepage: null, size: 5000 })).toBe(true)
  })

  it('excludes this portfolio repo itself by name', () => {
    expect(isExcludedRepo({ ...baseRepo, name: 'talha', description: null, homepage: 'https://talha-five.vercel.app' })).toBe(true)
  })

  it('excludes repos whose description reads as lab/coursework, even with a homepage', () => {
    expect(isExcludedRepo({ ...baseRepo, name: 'OOPS_in_python', description: 'Assigments  lab task  ', homepage: null })).toBe(true)
  })
})

describe('classifyCategory', () => {
  it('detects e-commerce from description', () => {
    expect(classifyCategory(baseRepo)).toBe('E-commerce')
  })

  it('detects AI/GenAI from description', () => {
    expect(classifyCategory({ ...baseRepo, description: 'AI teacher using Gemini model' })).toBe('AI / GenAI')
  })

  it('falls back to Web App', () => {
    expect(classifyCategory({ ...baseRepo, name: 'generic-app', description: 'A dashboard tool' })).toBe('Web App')
  })

  it('does not match keywords as substrings of unrelated words', () => {
    expect(classifyCategory({ ...baseRepo, name: 'VirtualR', description: 'A portfolio site built using tailwind and react' })).toBe('Web App')
  })

  it('detects keywords in PascalCase repo names with no separators', () => {
    expect(classifyCategory({ ...baseRepo, name: 'PharmacyStore', description: null })).toBe('E-commerce')
  })
})

describe('classifyStatus', () => {
  it('is Live when a homepage exists', () => {
    expect(classifyStatus(baseRepo)).toBe('Live')
  })

  it('is In Progress when recently updated with no homepage', () => {
    const recent = new Date()
    recent.setMonth(recent.getMonth() - 1)
    expect(classifyStatus({ ...baseRepo, homepage: null, updated_at: recent.toISOString() })).toBe('In Progress')
  })

  it('is Completed when old and no homepage', () => {
    expect(classifyStatus({ ...baseRepo, homepage: null, updated_at: '2022-01-01T00:00:00Z' })).toBe('Completed')
  })
})

describe('toProjectEntry', () => {
  it('maps a repo to the project entry shape', () => {
    const entry = toProjectEntry(baseRepo)
    expect(entry).toMatchObject({
      id: 'shop-it',
      title: 'SHOP-IT',
      description: 'Ecommerce platform for B2B sellers',
      image: null,
      github: baseRepo.html_url,
      live: baseRepo.homepage,
      tech: ['JavaScript'],
      category: 'E-commerce',
      status: 'Live',
      featured: false,
      source: 'github',
      stars: 1,
    })
  })
})
