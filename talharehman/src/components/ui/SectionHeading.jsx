import { motion, useReducedMotion } from 'framer-motion'

const MotionDiv = motion.div

export function SectionHeading({ eyebrow, title, subtitle }) {
  const reduceMotion = useReducedMotion()

  return (
    <MotionDiv
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col gap-3 text-center sm:text-left"
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-aurora-cyan [html[data-theme=light]_&]:text-cyan-700">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-white/70 [html[data-theme=light]_&]:text-neutral-600">{subtitle}</p>}
    </MotionDiv>
  )
}
