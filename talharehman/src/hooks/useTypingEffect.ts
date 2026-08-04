import { useEffect, useState } from 'react'

interface TypingOptions {
  typingSpeedMs?: number
  deletingSpeedMs?: number
  pauseMs?: number
  /** When true, skip the animation entirely and return the first string as static text. */
  reduceMotion?: boolean
}

export function useTypingEffect(strings: string[], options: TypingOptions = {}): string {
  const { typingSpeedMs = 60, deletingSpeedMs = 30, pauseMs = 1500, reduceMotion = false } = options
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (reduceMotion || strings.length === 0) return

    const current = strings[index % strings.length]
    const atFullText = !isDeleting && text === current
    const atEmptyText = isDeleting && text === ''

    if (atFullText) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseMs)
      return () => clearTimeout(timeout)
    }

    if (atEmptyText) {
      setIsDeleting(false)
      setIndex((i) => (i + 1) % strings.length)
      return
    }

    const nextLength = isDeleting ? text.length - 1 : text.length + 1
    const timeout = setTimeout(() => {
      setText(current.slice(0, nextLength))
    }, isDeleting ? deletingSpeedMs : typingSpeedMs)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, strings, typingSpeedMs, deletingSpeedMs, pauseMs, reduceMotion])

  if (reduceMotion) return strings[0] ?? ''

  return text
}
