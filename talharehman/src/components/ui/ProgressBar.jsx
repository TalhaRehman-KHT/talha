import { motion, useReducedMotion } from 'framer-motion'
import { Counter } from './Counter'

const MotionFill = motion.div

export function ProgressBar({ value, label }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>{label}</span>
          <span className="text-white/60 [html[data-theme=light]_&]:text-neutral-500">
            <Counter value={value} duration={1} />%
          </span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10 [html[data-theme=light]_&]:bg-black/10"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <MotionFill
          initial={reduceMotion ? { width: `${value}%` } : { width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-teal"
        />
      </div>
    </div>
  )
}
