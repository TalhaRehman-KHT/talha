import { Github, Linkedin, Mail } from 'lucide-react'
import social from '../../data/social.json'
import profile from '../../data/profile.json'

const LINKS = [
  { key: 'github', href: social.github, label: 'GitHub', Icon: Github },
  { key: 'linkedin', href: social.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { key: 'email', href: `mailto:${social.email}`, label: 'Email', Icon: Mail },
].filter((link) => Boolean(link.href))

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-sm text-white/60 [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:text-neutral-500">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <div className="flex gap-4">
          {LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className="rounded hover:text-aurora-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan"
            >
              <link.Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
