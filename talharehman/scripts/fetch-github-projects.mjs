import { writeFile } from 'node:fs/promises'
import { isExcludedRepo, toProjectEntry } from './lib/classify.mjs'

const USERNAME = 'TalhaRehman-KHT'
const headers = process.env.GITHUB_TOKEN
  ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
  : {}

async function fetchJson(url) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} (${url})`)
  }
  return response.json()
}

async function main() {
  const [profile, repos] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
  ])

  const projects = repos
    .filter((repo) => !isExcludedRepo(repo))
    .map(toProjectEntry)

  const languageCounts = repos.reduce((counts, repo) => {
    if (!repo.language) return counts
    counts[repo.language] = (counts[repo.language] ?? 0) + 1
    return counts
  }, {})

  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  const stats = {
    publicRepos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    topLanguages,
  }

  await writeFile('src/data/projects.github.json', JSON.stringify(projects, null, 2) + '\n')
  await writeFile('src/data/github.stats.json', JSON.stringify(stats, null, 2) + '\n')

  console.log(`Wrote ${projects.length} projects and stats for @${USERNAME}.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
