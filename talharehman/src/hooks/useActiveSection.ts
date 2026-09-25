import { useEffect, useState } from 'react'

// A section becomes active once its top scrolls past this fraction of the viewport.
const READING_LINE = 0.4
// Tolerance for "scrolled to the bottom" (sub-pixel rounding, mobile URL bars).
const BOTTOM_TOLERANCE_PX = 2

function findActiveSection(sectionIds: string[]): string | null {
  // Looked up on every call rather than once on mount: most sections are
  // React.lazy, so they aren't in the DOM yet when the navbar first renders.
  const present = sectionIds.filter((id) => document.getElementById(id) !== null)
  if (present.length === 0) return null

  // The last section is often too short to ever reach the reading line, so
  // hitting the bottom of the page counts as reaching it.
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_TOLERANCE_PX
  if (scrolledToBottom) return present[present.length - 1]

  // The active section is the last one whose top has passed the reading line.
  // Unlike picking the "most visible" section, this keeps a tall section (e.g.
  // About with its certifications grid) active while scrolling through it.
  const line = window.innerHeight * READING_LINE
  let active = present[0]
  for (const id of present) {
    if (document.getElementById(id)!.getBoundingClientRect().top <= line) active = id
  }
  return active
}

export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    function update() {
      frame = 0
      setActiveId(findActiveSection(sectionIds))
    }

    function scheduleUpdate() {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sectionIds])

  return activeId
}
