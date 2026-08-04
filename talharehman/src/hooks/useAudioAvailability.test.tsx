import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAudioAvailability } from './useAudioAvailability'

function mockResponse(ok: boolean, contentType: string, status = 200) {
  return {
    ok,
    status,
    headers: { get: (name: string) => (name === 'content-type' ? contentType : null) },
  } as Response
}

describe('useAudioAvailability', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts as null while the check is in flight', () => {
    vi.spyOn(window, 'fetch').mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useAudioAvailability('/audio/intro.mp3'))
    expect(result.current).toBeNull()
  })

  it('resolves true when the file responds ok with an audio content-type', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse(true, 'audio/mpeg'))
    const { result } = renderHook(() => useAudioAvailability('/audio/intro.mp3'))
    await waitFor(() => expect(result.current).toBe(true))
  })

  it('resolves false when the file 404s', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse(false, '', 404))
    const { result } = renderHook(() => useAudioAvailability('/audio/intro.mp3'))
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('resolves false when the SPA rewrite serves index.html with a 200 (Vercel catch-all)', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue(mockResponse(true, 'text/html; charset=utf-8'))
    const { result } = renderHook(() => useAudioAvailability('/audio/intro.mp3'))
    await waitFor(() => expect(result.current).toBe(false))
  })

  it('resolves false when fetch itself rejects', async () => {
    vi.spyOn(window, 'fetch').mockRejectedValue(new Error('network error'))
    const { result } = renderHook(() => useAudioAvailability('/audio/intro.mp3'))
    await waitFor(() => expect(result.current).toBe(false))
  })
})
