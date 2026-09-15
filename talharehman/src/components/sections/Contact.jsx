import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Copy, Check, MessageCircle, MapPin } from 'lucide-react'
import social from '../../data/social.json'
import profile from '../../data/profile.json'
import { submitContact } from '../../lib/submitContact'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

const MotionP = motion.p

const SOCIAL_LINKS = [
  { key: 'email', href: `mailto:${social.email}`, label: 'Email', Icon: Mail },
  { key: 'github', href: social.github, label: 'GitHub', Icon: Github },
  { key: 'linkedin', href: social.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { key: 'whatsapp', href: social.whatsapp, label: 'WhatsApp', Icon: MessageCircle },
].filter((link) => Boolean(link.href))

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields) {
  const errors = {}
  if (!fields.name.trim()) errors.name = 'Please enter your name.'
  if (!fields.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!EMAIL_PATTERN.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!fields.message.trim()) errors.message = 'Please enter a message.'
  return errors
}

const inputClasses =
  'w-full rounded-lg border bg-white/5 p-3 outline-none focus:border-aurora-cyan [html[data-theme=light]_&]:bg-black/5'

export function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [copied, setCopied] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('sending')
    try {
      await submitContact(event.target)
      setStatus('success')
      setFields({ name: '', email: '', message: '' })
      event.target.reset()
    } catch {
      setStatus('error')
    }
  }

  async function handleCopyEmail() {
    await navigator.clipboard.writeText(social.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading eyebrow="Contact" title="Let's Build Something" subtitle="Open to full-stack and AI engineering roles, freelance work, and collaborations." />

      <p className="mb-6 flex items-center gap-2 text-sm text-white/60 [html[data-theme=light]_&]:text-neutral-500">
        <MapPin size={16} aria-hidden="true" /> {profile.location}
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {SOCIAL_LINKS.map((link) => (
          <Button key={link.key} href={link.href} variant="ghost" icon={<link.Icon size={16} />}>
            {link.label}
          </Button>
        ))}
        <button
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/90 hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora-cyan [html[data-theme=light]_&]:border-black/10 [html[data-theme=light]_&]:text-neutral-700 [html[data-theme=light]_&]:hover:border-black/30"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? 'Copied!' : 'Copy Email'}
        </button>
      </div>

      <GlassCard className="p-6">
        <form
          action="https://formsubmit.co/talhakhank51@gmail.com"
          method="POST"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="_captcha" value="false" />

          <div>
            <label htmlFor="contact-name" className="sr-only">Your Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={fields.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              className={`${inputClasses} ${errors.name ? 'border-red-400' : 'border-white/10 [html[data-theme=light]_&]:border-black/10'}`}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">Your Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Your Email"
              value={fields.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              className={`${inputClasses} ${errors.email ? 'border-red-400' : 'border-white/10 [html[data-theme=light]_&]:border-black/10'}`}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="sr-only">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={fields.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={`${inputClasses} ${errors.message ? 'border-red-400' : 'border-white/10 [html[data-theme=light]_&]:border-black/10'}`}
            />
            {errors.message && (
              <p id="contact-message-error" className="mt-1 text-xs text-red-400">{errors.message}</p>
            )}
          </div>

          <Button as="button" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </Button>

          <div aria-live="polite" className="min-h-[1.5rem]">
            <AnimatePresence>
              {status === 'success' && (
                <MotionP
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-400"
                >
                  Message sent — I&apos;ll get back to you soon.
                </MotionP>
              )}
              {status === 'error' && (
                <MotionP
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400"
                >
                  Something went wrong — please email me directly instead.
                </MotionP>
              )}
            </AnimatePresence>
          </div>
        </form>
      </GlassCard>
    </section>
  )
}
