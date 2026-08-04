import { useEffect } from 'react'
import { FileDown, ExternalLink } from 'lucide-react'
import profile from '../../data/profile.json'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'

export function Resume() {
  const resumePath = profile.resumePath

  useEffect(() => {
    if (!resumePath) return
    fetch(resumePath, { method: 'HEAD' })
      .then((response) => {
        // The SPA rewrite (vercel.json) sends missing paths to index.html with a 200,
        // so a real PDF is distinguished by its content-type, not just response.ok.
        const contentType = response.headers.get('content-type') ?? ''
        if (!response.ok || contentType.includes('text/html')) {
          console.warn(`Resume file not found at "${resumePath}" (status ${response.status}).`)
        }
      })
      .catch(() => {
        console.warn(`Resume file not found at "${resumePath}".`)
      })
  }, [resumePath])

  return (
    <div className="mx-auto max-w-5xl px-6 pb-4">
      <GlassCard className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
        <div>
          <h3 className="font-semibold">Resume</h3>
          <p className="text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
            {resumePath ? 'Download my latest resume.' : 'Resume coming soon.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            href={resumePath ?? undefined}
            download={resumePath ? 'Talha-Rehman-CV.pdf' : undefined}
            icon={<FileDown size={16} aria-hidden="true" />}
            className={resumePath ? '' : 'pointer-events-none opacity-50'}
            aria-disabled={!resumePath}
          >
            {resumePath ? 'Download Resume' : 'Coming Soon'}
          </Button>
          {resumePath && (
            <Button
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              icon={<ExternalLink size={16} aria-hidden="true" />}
            >
              View
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
