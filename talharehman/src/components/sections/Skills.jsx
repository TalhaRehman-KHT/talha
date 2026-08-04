import { useMemo } from 'react'
import { motion } from 'framer-motion'
import skills from '../../data/skills.json'
import { GlassCard } from '../ui/GlassCard'
import { ProgressBar } from '../ui/ProgressBar'
import { SectionHeading } from '../ui/SectionHeading'

const MotionDiv = motion.div

const CATEGORY_ORDER = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'AI Tools',
  'Cloud',
  'Dev Tools',
  'Version Control',
  'Deployment',
]

function groupByCategory(items) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0)
}

export function Skills() {
  const groups = useMemo(() => groupByCategory(skills), [])

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Skills" title="What I Work With" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, index) => (
          <MotionDiv
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
          >
            <GlassCard className="flex h-full flex-col gap-4 p-6">
              <h3 className="font-semibold text-aurora-cyan">{group.category}</h3>
              <div className="flex flex-col gap-3">
                {group.items.map((skill) => (
                  <ProgressBar key={skill.name} value={skill.level} label={skill.name} />
                ))}
              </div>
            </GlassCard>
          </MotionDiv>
        ))}
      </div>
    </section>
  )
}
