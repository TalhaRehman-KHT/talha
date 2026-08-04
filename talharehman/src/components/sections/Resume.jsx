import { FileDown } from 'lucide-react'
import profile from '../../data/profile.json'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'

export function Resume() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-4">
      <GlassCard className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div>
          <h3 className="font-semibold">Resume</h3>
          <p className="text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
            {profile.resumeUrl ? 'Download my latest resume.' : 'Resume coming soon.'}
          </p>
        </div>
        <Button
          href={profile.resumeUrl ?? undefined}
          icon={<FileDown size={16} />}
          className={profile.resumeUrl ? '' : 'pointer-events-none opacity-50'}
          aria-disabled={!profile.resumeUrl}
        >
          {profile.resumeUrl ? 'Download Resume' : 'Coming Soon'}
        </Button>
      </GlassCard>
    </div>
  )
}
