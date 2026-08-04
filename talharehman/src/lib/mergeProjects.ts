export interface Project {
  id: string
  title: string
  description: string
  image: string | null
  github: string
  live: string | null
  tech: string[]
  features: string[]
  category: string
  status: string
  featured: boolean
  stars: number
}

type CuratedProject = Omit<Project, 'stars'>
type GithubProject = Project & { source: 'github'; updatedAt: string }

function normalizeUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, '')
}

export function mergeProjects(
  curated: CuratedProject[],
  github: GithubProject[]
): Project[] {
  const githubByUrl = new Map(github.map((project) => [normalizeUrl(project.github), project]))
  const seen = new Set<string>()

  const merged: Project[] = curated.map((project) => {
    const key = normalizeUrl(project.github)
    seen.add(key)
    const liveData = githubByUrl.get(key)
    return {
      ...project,
      stars: liveData?.stars ?? 0,
      tech: project.tech.length > 0 ? project.tech : liveData?.tech ?? [],
    }
  })

  for (const project of github) {
    const key = normalizeUrl(project.github)
    if (seen.has(key)) continue
    const { source: _source, updatedAt: _updatedAt, ...rest } = project
    merged.push(rest)
  }

  return merged
}
