import { motion, useReducedMotion } from 'framer-motion'

const MotionDiv = motion.div

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-surface-dark [html[data-theme=light]_&]:bg-surface-light" />
      <MotionDiv
        className="absolute -left-1/4 top-[-10%] h-[60vh] w-[60vh] rounded-full bg-aurora-violet/30 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionDiv
        className="absolute right-[-15%] top-1/4 h-[50vh] w-[50vh] rounded-full bg-aurora-cyan/25 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionDiv
        className="absolute bottom-[-15%] left-1/3 h-[55vh] w-[55vh] rounded-full bg-aurora-teal/20 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
