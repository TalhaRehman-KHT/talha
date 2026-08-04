import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import experience from '../../data/experience.json'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { SectionHeading } from '../ui/SectionHeading'

const MotionDiv = motion.div

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've Worked"
        subtitle="Contract and internship roles building production web apps."
      />

      <div className="relative flex flex-col gap-8 border-l border-white/10 pl-8 [html[data-theme=light]_&]:border-black/10">
        {experience.map((entry, index) => (
          <MotionDiv
            key={entry.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-aurora-violet to-aurora-cyan">
              <Briefcase size={12} className="text-white" aria-hidden="true" />
            </span>
            <GlassCard className="p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{entry.role} &middot; {entry.company}</h3>
                <div className="flex items-center gap-2">
                  {entry.placeholder && <Badge className="text-amber-300">Placeholder</Badge>}
                  <Badge>{entry.dates}</Badge>
                </div>
              </div>
              <p className="text-sm text-white/70 [html[data-theme=light]_&]:text-neutral-600">{entry.summary}</p>
            </GlassCard>
          </MotionDiv>
        ))}
      </div>
    </section>
  )
}
