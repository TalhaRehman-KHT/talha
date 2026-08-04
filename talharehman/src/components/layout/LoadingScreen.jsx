import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const MotionDiv = motion.div
const MotionSpan = motion.span

const SESSION_KEY = 'portfolio-loaded'
const MIN_DISPLAY_MS = 1200

export function LoadingScreen({ onFinish }) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => !reduceMotion && !sessionStorage.getItem(SESSION_KEY))

  useEffect(() => {
    if (!visible) {
      onFinish?.()
      return
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setVisible(false)
      onFinish?.()
    }, MIN_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [visible, onFinish])

  return (
    <AnimatePresence>
      {visible && (
        <MotionDiv
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dark"
        >
          <MotionSpan
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-teal bg-clip-text text-4xl font-bold text-transparent"
          >
            TR
          </MotionSpan>
        </MotionDiv>
      )}
    </AnimatePresence>
  )
}
