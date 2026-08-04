import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

const MotionDiv = motion.div

export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smoothed = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const scaleX = reduceMotion ? scrollYProgress : smoothed

  return (
    <MotionDiv
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-teal"
    />
  )
}
