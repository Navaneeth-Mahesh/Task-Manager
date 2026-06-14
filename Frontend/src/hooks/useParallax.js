import { useState, useEffect, useCallback } from 'react'

export function useParallax(strength = 0.02) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * strength * 100
    const y = (e.clientY / window.innerHeight - 0.5) * strength * 100
    setPos({ x, y })
  }, [strength])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return pos
}
