import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const MotionDiv = motion.div

export function MagneticButton({ children, className, strength = 20 }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  function handlePointerMove(event) {
    if (reduceMotion) return
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    const relativeX = event.clientX - (bounds.left + bounds.width / 2)
    const relativeY = event.clientY - (bounds.top + bounds.height / 2)
    x.set((relativeX / bounds.width) * strength)
    y.set((relativeY / bounds.height) * strength)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <MotionDiv
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </MotionDiv>
  )
}
