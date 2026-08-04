import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContact } from './submitContact'

describe('submitContact', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form action="https://formsubmit.co/test@example.com" method="POST">
        <input name="name" value="Jane" />
        <input name="email" value="jane@example.com" />
        <textarea name="message">Hello</textarea>
      </form>
    `
  })

  it('POSTs the form data to the form action and resolves on success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true })
    const form = document.querySelector('form')

    await expect(submitContact(form)).resolves.toBeUndefined()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://formsubmit.co/test@example.com',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws when the response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    const form = document.querySelector('form')

    await expect(submitContact(form)).rejects.toThrow()
  })
})
