const EXCLUDED_NAME_PATTERNS = [
  /todo/i,
  /assignment/i,
  /crud-with/i,
  /^taskapp$/i,
  /internship/i,
]

export function isExcludedRepo(repo) {
  if (repo.fork || repo.archived) return true
  if (EXCLUDED_NAME_PATTERNS.some((pattern) => pattern.test(repo.name))) return true

  const hasSignal = Boolean(repo.description) || Boolean(repo.homepage) || repo.size > 100
  return !hasSignal
}

const CATEGORY_RULES = [
  { category: 'AI / GenAI', keywords: ['ai', 'gpt', 'gemini', 'genai', 'llm'] },
  { category: 'E-commerce', keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'pharmacy', 'seller'] },
]

export function classifyCategory(repo) {
  const haystack = `${repo.description ?? ''}`.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return rule.category
    }
  }
  return 'Web App'
}

const IN_PROGRESS_WINDOW_DAYS = 90

export function classifyStatus(repo) {
  if (repo.homepage) return 'Live'

  const updatedAt = new Date(repo.updated_at)
  const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceUpdate <= IN_PROGRESS_WINDOW_DAYS ? 'In Progress' : 'Completed'
}

export function toProjectEntry(repo) {
  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: repo.name,
    description: repo.description ?? '',
    image: null,
    github: repo.html_url,
    live: repo.homepage || null,
    tech: repo.language ? [repo.language] : [],
    features: [],
    category: classifyCategory(repo),
    status: classifyStatus(repo),
    featured: false,
    source: 'github',
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
  }
}
