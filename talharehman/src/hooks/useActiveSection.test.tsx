import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, act, cleanup } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

const VIEWPORT_HEIGHT = 1000

// Section tops relative to the viewport, keyed by id. jsdom has no layout, so
// each test positions sections by stubbing getBoundingClientRect.
let tops: Record<string, number>

function addSection(id: string) {
  const el = document.createElement('section')
  el.id = id
  el.getBoundingClientRect = () => ({ top: tops[id] ?? 99999 }) as DOMRect
  document.body.appendChild(el)
}

function scrollTo(nextTops: Record<string, number>) {
  tops = nextTops
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

function Probe({ ids }: { ids: string[] }) {
  const active = useActiveSection(ids)
  return <span data-testid="active">{active ?? 'none'}</span>
}

const IDS = ['home', 'about', 'projects', 'contact']

describe('useActiveSection', () => {
  beforeEach(() => {
    tops = {}
    document.body.innerHTML = ''
    vi.stubGlobal('innerHeight', VIEWPORT_HEIGHT)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(10000)
    vi.stubGlobal('scrollY', 0)
    // Run the frame-throttled update synchronously so assertions follow the scroll.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('marks the first section active at the top of the page', () => {
    tops = { home: 0, about: 1200 }
    addSection('home')
    addSection('about')
    const { getByTestId } = render(<Probe ids={IDS} />)
    expect(getByTestId('active').textContent).toBe('home')
  })

  it('switches to the section whose top has passed the 40% reading line', () => {
    tops = { home: 0, about: 1200 }
    addSection('home')
    addSection('about')
    const { getByTestId } = render(<Probe ids={IDS} />)
    scrollTo({ home: -900, about: 300 })
    expect(getByTestId('active').textContent).toBe('about')
  })

  it('highlights sections that mount after the hook (lazy-loaded Projects)', () => {
    tops = { home: 0, about: 1200 }
    addSection('home')
    addSection('about')
    const { getByTestId } = render(<Probe ids={IDS} />)

    // Projects is React.lazy — it only appears in the DOM after first render.
    addSection('projects')
    scrollTo({ home: -3000, about: -2000, projects: 100 })
    expect(getByTestId('active').textContent).toBe('projects')
  })

  it('keeps a tall section active while scrolling through its middle (About → Certifications)', () => {
    tops = { home: 0, about: 1200, projects: 5000 }
    addSection('home')
    addSection('about')
    addSection('projects')
    const { getByTestId } = render(<Probe ids={IDS} />)
    // About's top is far above the viewport and Projects hasn't arrived yet —
    // the reader is deep in the certifications grid.
    scrollTo({ home: -4000, about: -2500, projects: 900 })
    expect(getByTestId('active').textContent).toBe('about')
  })

  it('marks the last section active once the page is scrolled to the bottom', () => {
    tops = { home: 0 }
    addSection('home')
    addSection('projects')
    addSection('contact')
    const { getByTestId } = render(<Probe ids={IDS} />)
    // Contact is short and never reaches the reading line, but we're at the bottom.
    vi.stubGlobal('scrollY', 10000 - VIEWPORT_HEIGHT)
    scrollTo({ home: -8000, projects: -200, contact: 600 })
    expect(getByTestId('active').textContent).toBe('contact')
  })

  it('stops listening to scroll after unmount', () => {
    tops = { home: 0 }
    addSection('home')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Probe ids={IDS} />)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
