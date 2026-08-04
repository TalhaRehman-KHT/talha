import { useEffect, useState } from 'react'

/**
 * Checks whether an audio file actually exists at `src`. This app's SPA
 * rewrite (see vercel.json) sends every unmatched path to index.html with a
 * 200, so `response.ok` alone can't tell a missing file from a real one —
 * a rewritten response comes back as text/html instead of an audio type.
 * Returns null while the check is in flight, then true/false.
 */
export function useAudioAvailability(src: string): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(src, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('content-type') ?? ''
        const isRealFile = response.ok && !contentType.includes('text/html')
        if (!cancelled) setAvailable(isRealFile)
      })
      .catch(() => {
        if (!cancelled) setAvailable(false)
      })

    return () => {
      cancelled = true
    }
  }, [src])

  return available
}
