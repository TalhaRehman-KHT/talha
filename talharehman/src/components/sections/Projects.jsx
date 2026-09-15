import { memo, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Globe, Search, FolderSearch } from 'lucide-react'
import curated from '../../data/projects.curated.json'
import githubProjects from '../../data/projects.github.json'
import { mergeProjects } from '../../lib/mergeProjects'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { SectionHeading } from '../ui/SectionHeading'

const MotionDiv = motion.div

const allProjects = mergeProjects(curated, githubProjects)
const CATEGORIES = ['All', ...new Set(allProjects.map((project) => project.category))]

const ProjectCard = memo(function ProjectCard({ project }) {
  return (
    <GlassCard className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          {project.featured && <Badge className="mt-1">Featured</Badge>}
        </div>
        <Badge>{project.status}</Badge>
      </div>

      <p className="text-sm text-white/70 [html[data-theme=light]_&]:text-neutral-600">
        {project.description || 'No description provided yet.'}
      </p>

      {project.features.length > 0 && (
        <ul className="list-disc pl-4 text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <div className="mt-auto flex gap-3 pt-2">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded text-sm text-aurora-cyan hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan"
          >
            <Globe size={14} aria-hidden="true" /> Live
          </a>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded text-sm text-white/70 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan [html[data-theme=light]_&]:text-neutral-600"
        >
          <Github size={14} aria-hidden="true" /> Code
        </a>
      </div>
    </GlassCard>
  )
})

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory
      const matchesQuery =
        query.trim() === '' ||
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.tech.some((tech) => tech.toLowerCase().includes(query.toLowerCase()))
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Projects" title="What I've Built" subtitle="A mix of client work, full-stack apps, and GenAI experiments." />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={category === activeCategory}
              className={
                category === activeCategory
                  ? 'rounded-full bg-gradient-to-r from-aurora-violet to-aurora-cyan px-4 py-1.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan'
                  : 'rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:text-neutral-600'
              }
            >
              {category}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-sm [html[data-theme=light]_&]:border-black/10">
          <Search size={14} className="text-white/50 [html[data-theme=light]_&]:text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Search projects or tech</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or tech..."
            className="w-40 bg-transparent outline-none placeholder:text-white/40 sm:w-56 [html[data-theme=light]_&]:placeholder:text-neutral-400"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 py-16 text-center text-white/60 [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:text-neutral-500">
          <FolderSearch size={32} aria-hidden="true" />
          <p>No projects match &ldquo;{query || activeCategory}&rdquo;. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <MotionDiv
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
            >
              <ProjectCard project={project} />
            </MotionDiv>
          ))}
        </div>
      )}
    </section>
  )
}
