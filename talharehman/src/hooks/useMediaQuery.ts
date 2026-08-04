import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent | { matches: boolean }) => setMatches(event.matches)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', handleChange as (event: MediaQueryListEvent) => void)
    return () => mediaQueryList.removeEventListener('change', handleChange as (event: MediaQueryListEvent) => void)
  }, [query])

  return matches
}
