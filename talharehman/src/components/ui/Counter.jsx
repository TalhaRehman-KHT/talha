import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, animate, useReducedMotion } from 'framer-motion'

export function Counter({ value, duration = 1.2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (reduceMotion) {
      if (ref.current) ref.current.textContent = value.toString()
      return
    }
    const controls = animate(motionValue, value, {
      duration,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = Math.round(latest).toString()
      },
    })
    return () => controls.stop()
  }, [isInView, value, duration, motionValue, reduceMotion])

  return <span ref={ref}>0</span>
}
