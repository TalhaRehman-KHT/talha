import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const MotionDiv = motion.div

export function CursorGlow() {
  const isDesktop = useMediaQuery('(pointer: fine)')
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 300, damping: 40 })
  const springY = useSpring(y, { stiffness: 300, damping: 40 })

  useEffect(() => {
    if (!isDesktop || reduceMotion) return

    function handlePointerMove(event) {
      x.set(event.clientX)
      y.set(event.clientY)
      if (!visible) setVisible(true)
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [isDesktop, reduceMotion, visible, x, y])

  if (!isDesktop || reduceMotion) return null

  return (
    <MotionDiv
      aria-hidden="true"
      style={{ left: springX, top: springY, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed z-30 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora-cyan/10 blur-2xl transition-opacity duration-300"
    />
  )
}
