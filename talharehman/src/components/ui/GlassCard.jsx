import clsx from 'clsx'
import { motion } from 'framer-motion'

export function GlassCard({ children, className, as = 'div', ...rest }) {
  const Component = motion[as] ?? motion.div

  return (
    <Component
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/20',
        'dark:border-white/10 dark:bg-white/5',
        '[html[data-theme="light"]_&]:border-black/10 [html[data-theme="light"]_&]:bg-white/70 [html[data-theme="light"]_&]:shadow-black/5',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
