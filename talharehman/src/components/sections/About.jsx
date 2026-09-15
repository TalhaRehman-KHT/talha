import { motion } from 'framer-motion'
import { GraduationCap, Award, GitFork, Users, UserPlus } from 'lucide-react'
import profile from '../../data/profile.json'
import education from '../../data/education.json'
import certifications from '../../data/certifications.json'
import githubStats from '../../data/github.stats.json'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeading } from '../ui/SectionHeading'
import { Badge } from '../ui/Badge'
import { Counter } from '../ui/Counter'

const MotionDiv = motion.div

const STATS = [
  { key: 'publicRepos', label: 'Public Repos', Icon: GitFork },
  { key: 'followers', label: 'Followers', Icon: Users },
  { key: 'following', label: 'Following', Icon: UserPlus },
]

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading eyebrow="About Me" title="Who I Am" subtitle={profile.objective} />

      <p className="mb-8 max-w-3xl text-white/80 [html[data-theme=light]_&]:text-neutral-700">
        {profile.summary}
      </p>

      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <GlassCard className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-8">
            {STATS.map((stat) => (
              <div key={stat.key} className="flex items-center gap-3">
                <stat.Icon size={20} className="text-aurora-cyan" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold">
                    <Counter value={githubStats[stat.key]} />
                  </p>
                  <p className="text-xs text-white/50 [html[data-theme=light]_&]:text-neutral-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {githubStats.topLanguages.map((lang) => (
              <Badge key={lang.name}>{lang.name}</Badge>
            ))}
          </div>
        </GlassCard>
      </MotionDiv>

      <div className="grid gap-8 sm:grid-cols-2">
        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <GlassCard className="h-full p-6">
            <div className="mb-4 flex items-center gap-2 text-aurora-cyan">
              <GraduationCap size={20} aria-hidden="true" />
              <h3 className="font-semibold">Education</h3>
            </div>
            <ul className="flex flex-col gap-4">
              {education.map((item) => {
                const dates = item.dates ?? `${item.startYear} – ${item.endYear}`
                return (
                  <li key={item.id}>
                    <p className="font-medium">{item.degree}</p>
                    <p className="text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
                      {item.institution}
                      {item.location && ` (${item.location})`} &middot; {dates}
                    </p>
                    {item.cgpa && (
                      <p className="text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
                        CGPA: {item.cgpa}
                        {item.status && ` · ${item.status}`}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </GlassCard>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <GlassCard className="h-full p-6">
            <div className="mb-4 flex items-center gap-2 text-aurora-cyan">
              <Award size={20} aria-hidden="true" />
              <h3 className="font-semibold">Certifications</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <figure key={cert.id} className="flex flex-col gap-1.5">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    width={200}
                    height={112}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <figcaption className="text-xs leading-snug text-white/60 [html[data-theme=light]_&]:text-neutral-500">
                    <span className="block font-medium text-white/80 [html[data-theme=light]_&]:text-neutral-700">
                      {cert.title}
                    </span>
                    {cert.issuer && <span>{cert.issuer}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </GlassCard>
        </MotionDiv>
      </div>
    </section>
  )
}
