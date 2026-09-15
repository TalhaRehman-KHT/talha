import clsx from 'clsx'
import { motion } from 'framer-motion'

const VARIANT_CLASSES = {
  primary: 'bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-teal text-white shadow-lg shadow-aurora-cyan/20',
  ghost:
    'border border-white/15 text-white/90 hover:border-white/30 dark:border-white/15 hover:bg-white/5 [html[data-theme="light"]_&]:border-black/15 [html[data-theme="light"]_&]:text-neutral-700 [html[data-theme="light"]_&]:hover:border-black/30 [html[data-theme="light"]_&]:hover:bg-black/5',
}

export function Button({ as = 'button', href, onClick, variant = 'primary', icon, children, className, ...rest }) {
  const Component = href ? motion.a : motion[as] ?? motion.button

  return (
    <Component
      href={href}
      onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan',
        VARIANT_CLASSES[variant],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </Component>
  )
}
