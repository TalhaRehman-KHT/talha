import { motion, useReducedMotion } from 'framer-motion'
import {
  GraduationCap,
  Award,
  GitFork,
  Users,
  UserPlus,
  Search,
  ClipboardList,
  CheckCircle2,
  Code2,
  FlaskConical,
  Rocket,
  LifeBuoy,
} from 'lucide-react'
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

// Icons follow the order of profile.workingApproach.steps
const STEP_ICONS = [Search, ClipboardList, CheckCircle2, Code2, FlaskConical, Rocket, LifeBuoy]

export function About() {
  const reduceMotion = useReducedMotion()
  const workingApproach = profile.workingApproach

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      {/* Objective is the lead-in. The hero already carries the short summary,
          so only the longer background paragraph is repeated here. */}
      <SectionHeading eyebrow="About Me" title="Who I Am" subtitle={profile.objective} />

      <p className="mb-14 max-w-3xl text-white/80 [html[data-theme=light]_&]:text-neutral-700">
        {profile.background}
      </p>

      {workingApproach?.steps?.length > 0 && (
        <MotionDiv
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold">{workingApproach.title}</h3>
            {workingApproach.subtitle && (
              <p className="mt-1 max-w-2xl text-sm text-white/55 [html[data-theme=light]_&]:text-neutral-500">
                {workingApproach.subtitle}
              </p>
            )}

            <ol className="mt-8 flex flex-col">
              {workingApproach.steps.map((item, index) => {
                const Icon = STEP_ICONS[index] ?? CheckCircle2
                const isLast = index === workingApproach.steps.length - 1

                return (
                  <li key={item.step} className="relative flex gap-4 pb-8 last:pb-0">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-aurora-cyan/40 to-transparent"
                      />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-aurora-cyan/30 bg-aurora-cyan/10 text-aurora-cyan">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div className="pt-1">
                      <p className="font-medium">
                        <span className="mr-2 text-sm tabular-nums text-aurora-cyan">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {item.step}
                      </p>
                      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/60 [html[data-theme=light]_&]:text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </GlassCard>
        </MotionDiv>
      )}

      <MotionDiv
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
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
                  <p className="text-xs text-white/50 [html[data-theme=light]_&]:text-neutral-500">
                    {stat.label}
                  </p>
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
        <MotionDiv
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
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

        <MotionDiv
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
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