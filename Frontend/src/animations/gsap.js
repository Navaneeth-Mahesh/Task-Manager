import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Entrance animations ───────────────────────────────────────────────────────

/**
 * Fade + slide up a batch of elements as they enter the viewport.
 * Usage: animateOnScroll('.feature-card', { stagger: 0.08 })
 */
export function animateOnScroll(selector, options = {}) {
  const {
    stagger = 0.1,
    duration = 0.65,
    y = 40,
    start = 'top 88%',
    ease = 'power3.out',
  } = options

  const elements = document.querySelectorAll(selector)
  if (!elements.length) return

  gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      stagger,
      duration,
      ease,
      scrollTrigger: {
        trigger: elements[0],
        start,
        once: true,
      },
    }
  )
}

/**
 * Animate a batch individually as each enters the viewport.
 */
export function batchAnimateOnScroll(selector, options = {}) {
  const { stagger = 0.07, duration = 0.55, y = 30, start = 'top 90%' } = options

  ScrollTrigger.batch(selector, {
    start,
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y,
        stagger,
        duration,
        ease: 'power2.out',
      }),
  })
}

// ─── Counter animation ─────────────────────────────────────────────────────────

/**
 * Animate a number from 0 to target.
 * Usage: animateCounter(el, 94, { suffix: '%' })
 */
export function animateCounter(element, target, options = {}) {
  const { duration = 1.5, suffix = '', prefix = '', ease = 'power2.out', decimals = 0 } = options
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease,
    onUpdate() {
      element.textContent = prefix + obj.val.toFixed(decimals) + suffix
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      once: true,
    },
  })
}

// ─── Parallax ─────────────────────────────────────────────────────────────────

/**
 * GSAP-driven parallax on scroll (for hero elements).
 * Usage: parallaxOnScroll('.hero-glow', { speed: 0.3 })
 */
export function parallaxOnScroll(selector, options = {}) {
  const { speed = 0.2, start = 'top top', end = 'bottom top' } = options
  gsap.to(selector, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: selector,
      start,
      end,
      scrub: true,
    },
  })
}

// ─── Timeline reveal ──────────────────────────────────────────────────────────

/**
 * Animate a horizontal timeline step by step.
 * Usage: animateTimeline('.timeline-step')
 */
export function animateTimeline(selector) {
  const steps = document.querySelectorAll(selector)
  if (!steps.length) return

  steps.forEach((step, i) => {
    gsap.from(step, {
      opacity: 0,
      y: 30,
      duration: 0.5,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 88%',
        once: true,
      },
    })
  })
}

// ─── Card tilt ────────────────────────────────────────────────────────────────

/**
 * 3D tilt effect on hover using GSAP quickTo.
 * Call once after cards are mounted.
 * Usage: applyCardTilt('.feature-card')
 */
export function applyCardTilt(selector, options = {}) {
  const { maxTilt = 8, scale = 1.02, duration = 0.4 } = options
  const cards = document.querySelectorAll(selector)

  cards.forEach((card) => {
    const xTo = gsap.quickTo(card, 'rotateX', { duration, ease: 'power3.out' })
    const yTo = gsap.quickTo(card, 'rotateY', { duration, ease: 'power3.out' })
    const scaleTo = gsap.quickTo(card, 'scale', { duration, ease: 'power3.out' })

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      xTo(-dy * maxTilt)
      yTo(dx * maxTilt)
      scaleTo(scale)
    })

    card.addEventListener('mouseleave', () => {
      xTo(0)
      yTo(0)
      scaleTo(1)
    })

    gsap.set(card, { transformPerspective: 800, transformOrigin: 'center center' })
  })
}

// ─── Page transition ──────────────────────────────────────────────────────────

/**
 * Run a quick fade-up on a page container after navigation.
 * Usage: pageTransitionIn('#page-wrapper')
 */
export function pageTransitionIn(selector = '#page-wrapper') {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
  )
}

// ─── Shimmer loader ───────────────────────────────────────────────────────────

/**
 * Animate skeleton shimmer on a set of elements.
 * Usage: startSkeletonShimmer('.skeleton')
 */
export function startSkeletonShimmer(selector = '.skeleton') {
  const els = document.querySelectorAll(selector)
  if (!els.length) return

  gsap.to(els, {
    backgroundPositionX: '200%',
    duration: 1.5,
    stagger: 0.1,
    repeat: -1,
    ease: 'none',
  })
}

// ─── Staggered list ───────────────────────────────────────────────────────────

/**
 * Stagger animate a list of items from an array render.
 * Usage: animateListItems('.task-card')
 */
export function animateListItems(selector, options = {}) {
  const { stagger = 0.06, y = 20, duration = 0.4 } = options
  const items = document.querySelectorAll(selector)
  if (!items.length) return

  gsap.fromTo(
    items,
    { opacity: 0, y },
    { opacity: 1, y: 0, stagger, duration, ease: 'power2.out' }
  )
}

// ─── Stat number pop ─────────────────────────────────────────────────────────

/**
 * Scale-pop effect on stat cards when they enter view.
 */
export function animateStatCards(selector = '.stat-card') {
  ScrollTrigger.batch(selector, {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.from(batch, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.5)',
      }),
  })
}

export { gsap, ScrollTrigger }
