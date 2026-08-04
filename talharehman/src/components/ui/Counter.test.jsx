import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Counter } from './Counter'

describe('Counter', () => {
  it('renders the target value once the count-up animation settles', async () => {
    render(<Counter value={42} duration={0.05} />)
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
