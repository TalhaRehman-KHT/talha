// src/test/setup.js
import '@testing-library/jest-dom/vitest'

// jsdom has no IntersectionObserver; framer-motion's useInView/whileInView needs one.
// Reports every observed target as immediately intersecting so scroll-reveal animations
// (Counter, SectionHeading, ProgressBar, etc.) run in tests instead of hanging at their
// initial state. Individual tests that need to control intersection timing themselves
// (see useActiveSection.test.tsx) stub their own IntersectionObserver, which overrides this.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback
    }
    observe(target) {
      this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this)
    }
    unobserve() {}
    disconnect() {}
  }
}
