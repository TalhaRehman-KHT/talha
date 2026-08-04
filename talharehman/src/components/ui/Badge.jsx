import clsx from 'clsx'

export function Badge({ children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80',
        '[html[data-theme="light"]_&]:border-black/10 [html[data-theme="light"]_&]:bg-black/5 [html[data-theme="light"]_&]:text-neutral-700',
        className
      )}
    >
      {children}
    </span>
  )
}
