import profile from '../data/profile.json'
import skills from '../data/skills.json'
import projectsCurated from '../data/projects.curated.json'

export function buildIntroScript() {
  const topSkills = skills
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, 5)
    .map((skill) => skill.name)
    .join(', ')

  const featuredProjects = projectsCurated
    .filter((project) => project.featured)
    .slice(0, 3)
    .map((project) => project.title)
    .join(', ')

  return [
    `Hi, I'm ${profile.name}, a ${profile.role}.`,
    profile.summary,
    `My core skills include ${topSkills}.`,
    `Some of my featured projects are ${featuredProjects}.`,
    profile.objective,
  ].join(' ')
}
