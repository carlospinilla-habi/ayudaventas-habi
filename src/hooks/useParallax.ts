import { useEffect, useRef } from 'react'

interface ParallaxEntry {
  el: HTMLElement
  speed: number
  visible: boolean
  cachedTop: number
  cachedHeight: number
}

const entries: ParallaxEntry[] = []
let rafId = 0
let listening = false
let prefersReduced = false
let isMobile = false
let lastScrollY = -1

if (typeof window !== 'undefined') {
  prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isMobile = window.innerWidth <= 768
}

const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (observed) => {
          for (const o of observed) {
            const entry = entries.find((e) => e.el === o.target)
            if (entry) {
              entry.visible = o.isIntersecting
              if (o.isIntersecting) {
                const rect = o.target.getBoundingClientRect()
                entry.cachedTop = rect.top + window.scrollY
                entry.cachedHeight = rect.height
              }
            }
          }
        },
        { rootMargin: '200px 0px' }
      )
    : null

function tick() {
  rafId = 0
  const scrollY = window.scrollY
  if (scrollY === lastScrollY) return
  lastScrollY = scrollY

  const vh = window.innerHeight
  const viewCenter = scrollY + vh / 2

  for (const entry of entries) {
    if (!entry.visible) continue
    const elCenter = entry.cachedTop + entry.cachedHeight / 2
    const distance = (elCenter - viewCenter) / vh
    const offset = distance * entry.speed
    entry.el.style.transform = `translateY(${offset}px)`
  }
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(tick)
}

function startListening() {
  if (listening || prefersReduced || isMobile) return
  window.addEventListener('scroll', onScroll, { passive: true })
  listening = true
}

function stopListening() {
  if (!listening) return
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(rafId)
  rafId = 0
  listening = false
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(speed: number) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced || isMobile) return

    const rect = el.getBoundingClientRect()
    const entry: ParallaxEntry = {
      el,
      speed,
      visible: false,
      cachedTop: rect.top + window.scrollY,
      cachedHeight: rect.height,
    }
    entries.push(entry)
    io?.observe(el)
    startListening()

    return () => {
      io?.unobserve(el)
      const idx = entries.indexOf(entry)
      if (idx !== -1) entries.splice(idx, 1)
      if (entries.length === 0) stopListening()
      el.style.transform = ''
    }
  }, [speed])

  return ref
}
