import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

let observerCallback: IntersectionObserverCallback

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function Probe({ ids }: { ids: string[] }) {
  const active = useActiveSection(ids)
  return <span data-testid="active">{active ?? 'none'}</span>
}

describe('useActiveSection', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    document.body.innerHTML = '<div id="home"></div><div id="about"></div>'
  })

  it('starts with no active section before any intersection fires', () => {
    const { getByTestId } = render(<Probe ids={['home', 'about']} />)
    expect(getByTestId('active').textContent).toBe('none')
  })

  it('updates to the id of the most-intersecting section', () => {
    const { getByTestId } = render(<Probe ids={['home', 'about']} />)
    act(() => {
      observerCallback(
        [{ target: document.getElementById('about'), isIntersecting: true, intersectionRatio: 0.6 } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })
    expect(getByTestId('active').textContent).toBe('about')
  })
})
