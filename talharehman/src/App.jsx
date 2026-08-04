import { lazy, Suspense, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AnimatedBackground } from './components/layout/AnimatedBackground'
import { LoadingScreen } from './components/layout/LoadingScreen'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { CursorGlow } from './components/layout/CursorGlow'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Resume } from './components/sections/Resume'
import { About } from './components/sections/About'
import siteConfig from './data/siteConfig.json'

const Experience = lazy(() => import('./components/sections/Experience').then((m) => ({ default: m.Experience })))
const Skills = lazy(() => import('./components/sections/Skills').then((m) => ({ default: m.Skills })))
const Projects = lazy(() => import('./components/sections/Projects').then((m) => ({ default: m.Projects })))
const Contact = lazy(() => import('./components/sections/Contact').then((m) => ({ default: m.Contact })))
const VoiceIntroPlayer = lazy(() =>
  import('./components/audio/VoiceIntroPlayer').then((m) => ({ default: m.VoiceIntroPlayer }))
)

function App() {
  const [ready, setReady] = useState(false)

  return (
    <ThemeProvider>
      <LoadingScreen onFinish={() => setReady(true)} />
      <AnimatedBackground />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />

      <main className={ready ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}>
        <Hero />
        {siteConfig.audioIntro && (
          <div className="px-6 pb-16">
            <Suspense fallback={null}>
              <VoiceIntroPlayer />
            </Suspense>
          </div>
        )}
        <Resume />
        <About />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <Suspense fallback={null}>
          <Skills />
        </Suspense>
        <Suspense fallback={null}>
          <Projects />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </ThemeProvider>
  )
}

export default App
