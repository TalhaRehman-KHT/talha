import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import clsx from 'clsx'
import siteConfig from '../../data/siteConfig.json'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useTheme } from '../../context/ThemeContext'

const MotionUl = motion.ul

const SECTION_IDS = siteConfig.nav.map((item) => item.id)
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar() {
  const activeId = useActiveSection(SECTION_IDS)
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuToggleRef = useRef(null)
  const drawerRef = useRef(null)

  function handleNavClick(id) {
    scrollToSection(id)
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
    menuToggleRef.current?.focus()
  }

  // Focus trap: while the mobile drawer is open, Escape closes it and Tab/Shift+Tab
  // cycle only through the drawer's own focusable elements instead of leaking focus
  // out to the rest of the page.
  useEffect(() => {
    if (!menuOpen) return

    const drawer = drawerRef.current
    const focusables = drawer ? Array.from(drawer.querySelectorAll(FOCUSABLE_SELECTOR)) : []
    focusables[0]?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:bg-white/70">
        <button onClick={() => handleNavClick('home')} className="font-bold tracking-tight">
          Talha<span className="text-aurora-cyan">.</span>
        </button>

        {!isMobile && (
          <ul className="flex items-center gap-6 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={clsx(
                    'rounded transition-colors hover:text-aurora-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan',
                    activeId === item.id ? 'text-aurora-cyan font-semibold' : 'text-white/70 [html[data-theme=light]_&]:text-neutral-600'
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-white/10 p-2 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan [html[data-theme=light]_&]:border-black/10"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isMobile && (
            <button
              ref={menuToggleRef}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              className="rounded-full border border-white/10 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan [html[data-theme=light]_&]:border-black/10"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <MotionUl
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="menu"
            aria-label="Section navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-surface-dark-elevated/95 p-3 backdrop-blur-xl [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:bg-surface-light-elevated/95"
          >
            {siteConfig.nav.map((item) => (
              <li key={item.id} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={clsx(
                    'block w-full rounded-lg px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan',
                    activeId === item.id ? 'bg-white/10 text-aurora-cyan' : 'text-white/80 [html[data-theme=light]_&]:text-neutral-700'
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </MotionUl>
        )}
      </AnimatePresence>
    </header>
  )
}
