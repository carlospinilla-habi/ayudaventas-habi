import { useEffect, useRef, useState } from 'react'

/**
 * Tracks scroll progress through a container and returns a 0→1 value
 * that can be used to progressively reveal words.
 * - 0 = element just entered the bottom of the viewport
 * - 1 = element reached the center (or a configurable point)
 */
export function useScrollRevealText() {
  const containerRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setProgress(1)
      return
    }

    let active = false

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active) onScroll()
      },
      { rootMargin: '0px 0px -10% 0px' }
    )

    function onScroll() {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(tick)
    }

    function tick() {
      rafRef.current = 0
      if (!active || !el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Progress: 0 when bottom of element enters viewport,
      // 1 when top of element reaches 40% from top of viewport
      const start = vh
      const end = vh * 0.35
      const current = rect.top
      const p = 1 - (current - end) / (start - end)
      setProgress(Math.min(1, Math.max(0, p)))
    }

    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { containerRef, progress }
}
