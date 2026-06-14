// Lenis smooth scroll — install @studio-freight/lenis after cloning
// npm install @studio-freight/lenis
// Then uncomment the import below

import { useEffect, useRef } from 'react'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Native smooth scroll fallback (no external dep required)
    document.documentElement.style.scrollBehavior = 'smooth'

    // Uncomment after installing lenis:
    // import('@studio-freight/lenis').then(({ default: Lenis }) => {
    //   const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    //   lenisRef.current = lenis
    //   const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    //   requestAnimationFrame(raf)
    // })

    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  return lenisRef
}
