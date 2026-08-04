import { motion, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Mail, FileDown, ChevronDown } from 'lucide-react'
import profile from '../../data/profile.json'
import social from '../../data/social.json'
import { useTypingEffect } from '../../hooks/useTypingEffect'
import { Button } from '../ui/Button'
import { MagneticButton } from '../ui/MagneticButton'

const MotionDiv = motion.div
const MotionH1 = motion.h1
const MotionP = motion.p
const MotionButton = motion.button

export function Hero() {
  const reduceMotion = useReducedMotion()
  const typedTagline = useTypingEffect(profile.taglines, {
    typingSpeedMs: 55,
    pauseMs: 1800,
    reduceMotion,
  })

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 pt-24 text-center">
      <MotionDiv
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="h-36 w-36 overflow-hidden rounded-full border-2 border-aurora-cyan/60 shadow-lg shadow-aurora-cyan/20 sm:h-44 sm:w-44"
      >
        <img
          src={profile.avatar}
          alt={profile.name}
          width={176}
          height={176}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </MotionDiv>

      <MotionH1
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl font-bold sm:text-6xl"
      >
        Hi, I&apos;m {profile.name}
      </MotionH1>

      <p className="h-8 text-lg text-aurora-cyan sm:text-2xl">
        {typedTagline}
        {!reduceMotion && <span className="animate-pulse">|</span>}
      </p>

      <MotionP
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl text-white/70 [html[data-theme=light]_&]:text-neutral-600"
      >
        {profile.summary}
      </MotionP>

      <MotionDiv
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton>
          <Button href={`mailto:${social.email}`} icon={<Mail size={16} />}>
            Hire Me
          </Button>
        </MagneticButton>
        {profile.resumePath && (
          <Button
            href={profile.resumePath}
            download="Talha-Rehman-CV.pdf"
            variant="ghost"
            icon={<FileDown size={16} />}
          >
            Resume
          </Button>
        )}
        <Button href={social.github} variant="ghost" icon={<Github size={16} />}>
          GitHub
        </Button>
        {social.linkedin && (
          <Button href={social.linkedin} variant="ghost" icon={<Linkedin size={16} />}>
            LinkedIn
          </Button>
        )}
      </MotionDiv>

      <MotionButton
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        aria-label="Scroll to About section"
        className="absolute bottom-8 text-white/50 [html[data-theme=light]_&]:text-neutral-400"
      >
        <ChevronDown size={28} />
      </MotionButton>
    </section>
  )
}
