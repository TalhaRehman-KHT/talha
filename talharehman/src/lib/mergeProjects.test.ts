import { describe, it, expect } from 'vitest'
import { mergeProjects } from './mergeProjects'

const curated = [
  {
    id: 'shop-it',
    title: 'SHOP-IT',
    description: 'Hand-written description',
    image: '/assets/ecom.jpeg',
    github: 'https://github.com/TalhaRehman-KHT/SHOP-IT',
    live: 'https://shop-it-orpin.vercel.app',
    tech: ['React', 'Node.js'],
    features: ['B2B seller storefront'],
    category: 'E-commerce',
    status: 'Live',
    featured: true,
  },
]

const github = [
  {
    id: 'shop-it',
    title: 'SHOP-IT',
    description: 'Ecommerce platform for B2B sellers',
    image: null,
    github: 'https://github.com/TalhaRehman-KHT/SHOP-IT',
    live: 'https://shop-it-orpin.vercel.app',
    tech: ['JavaScript'],
    features: [],
    category: 'E-commerce',
    status: 'Live',
    featured: false,
    source: 'github' as const,
    stars: 3,
    updatedAt: '2025-03-08T00:00:00Z',
  },
  {
    id: 'greensoq',
    title: 'GreenSoq',
    description: '',
    image: null,
    github: 'https://github.com/TalhaRehman-KHT/GreenSoq',
    live: 'https://green-soq.vercel.app',
    tech: ['JavaScript'],
    features: [],
    category: 'Web App',
    status: 'Live',
    featured: false,
    source: 'github' as const,
    stars: 0,
    updatedAt: '2025-10-15T00:00:00Z',
  },
]

describe('mergeProjects', () => {
  it('deduplicates by GitHub URL, preferring curated fields but live stars', () => {
    const result = mergeProjects(curated, github)
    const shopIt = result.find((p) => p.id === 'shop-it')
    expect(result).toHaveLength(2)
    expect(shopIt?.description).toBe('Hand-written description')
    expect(shopIt?.image).toBe('/assets/ecom.jpeg')
    expect(shopIt?.stars).toBe(3)
    expect(shopIt?.featured).toBe(true)
  })

  it('includes github-only projects unmodified', () => {
    const result = mergeProjects(curated, github)
    const greensoq = result.find((p) => p.id === 'greensoq')
    expect(greensoq).toMatchObject({ title: 'GreenSoq', featured: false, stars: 0 })
  })

  it('matches by normalized github URL (trailing slash / case insensitive)', () => {
    const githubWithSlash = [{ ...github[0], github: 'https://github.com/TalhaRehman-KHT/Shop-It/' }]
    const result = mergeProjects(curated, githubWithSlash)
    expect(result).toHaveLength(1)
    expect(result[0].stars).toBe(3)
  })
})
