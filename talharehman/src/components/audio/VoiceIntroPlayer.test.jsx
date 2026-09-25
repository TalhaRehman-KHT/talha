import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { VoiceIntroPlayer } from './VoiceIntroPlayer'

class MockUtterance {
  constructor(text) {
    this.text = text
    this.onend = null
    this.onerror = null
  }
}

describe('VoiceIntroPlayer play button', () => {
  let speakSpy

  beforeEach(() => {
    speakSpy = vi.fn()
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
    vi.stubGlobal('speechSynthesis', {
      speak: speakSpy,
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: () => [],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    // No recorded intro: the SPA rewrite answers with index.html.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, headers: { get: () => 'text/html' } }))
    )
  })

  afterEach(() => {
    // Unmount while the speechSynthesis stub still exists — the hook cancels on unmount.
    cleanup()
    vi.unstubAllGlobals()
  })

  async function renderPlayer() {
    render(<VoiceIntroPlayer />)
    return screen.findByRole('button', { name: 'Play introduction' })
  }

  it('starts speaking and switches to a pause button when clicked', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    expect(speakSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Pause introduction' })).toBeInTheDocument()
  })

  it('pauses on second click and offers to resume', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    fireEvent.click(screen.getByRole('button', { name: 'Pause introduction' }))
    expect(screen.getByRole('button', { name: 'Resume introduction' })).toBeInTheDocument()
  })

  it('resumes the current sentence instead of restarting from the beginning', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    act(() => speakSpy.mock.calls[0][0].onend())
    // wait out the pause before the next sentence (350ms in a section, 600ms between sections)
    await act(() => new Promise((r) => setTimeout(r, 700)))
    const secondSentence = speakSpy.mock.calls[1][0].text

    fireEvent.click(screen.getByRole('button', { name: 'Pause introduction' }))
    fireEvent.click(screen.getByRole('button', { name: 'Resume introduction' }))

    const last = speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0]
    expect(last.text).toBe(secondSentence)
    expect(screen.getByRole('button', { name: 'Pause introduction' })).toBeInTheDocument()
  })

  it('has a draggable seek slider instead of a read-only progress bar', async () => {
    await renderPlayer()
    const slider = screen.getByRole('slider', { name: 'Seek introduction' })
    expect(slider).toHaveAttribute('type', 'range')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('dragging the slider forward while playing jumps ahead in the intro', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    const firstSentence = speakSpy.mock.calls[0][0].text
    fireEvent.change(screen.getByRole('slider', { name: 'Seek introduction' }), { target: { value: '0.9' } })
    const last = speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0]
    expect(last.text).not.toBe(firstSentence)
    expect(screen.getByRole('button', { name: 'Pause introduction' })).toBeInTheDocument()
  })

  it('dragging the slider back to the start while playing restarts the intro', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    const firstSentence = speakSpy.mock.calls[0][0].text
    const slider = screen.getByRole('slider', { name: 'Seek introduction' })
    fireEvent.change(slider, { target: { value: '0.9' } })
    fireEvent.change(slider, { target: { value: '0' } })
    const last = speakSpy.mock.calls[speakSpy.mock.calls.length - 1][0]
    expect(last.text).toBe(firstSentence)
  })

  it('replay restarts from the first sentence', async () => {
    const button = await renderPlayer()
    fireEvent.click(button)
    const firstSentence = speakSpy.mock.calls[0][0].text
    fireEvent.click(screen.getByRole('button', { name: 'Replay introduction' }))
    expect(speakSpy).toHaveBeenCalledTimes(2)
    expect(speakSpy.mock.calls[1][0].text).toBe(firstSentence)
  })
})
