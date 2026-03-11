import { useEffect, useRef } from 'react'

type Margin = 'default' | 'center'

const observers = new Map<Margin, IntersectionObserver>()
const observed = new Map<Element, { cb: () => void; margin: Margin }>()

const MARGINS: Record<Margin, string> = {
  default: '-60px 0px',
  center: '-35% 0px -35% 0px',
}

function getObserver(margin: Margin) {
  const existing = observers.get(margin)
  if (existing) return existing

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const item = observed.get(entry.target)
          if (item) item.cb()
          io.unobserve(entry.target)
          observed.delete(entry.target)
        }
      }
    },
    { rootMargin: MARGINS[margin] }
  )
  observers.set(margin, io)
  return io
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(margin: Margin = 'default') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = getObserver(margin)

    observed.set(el, {
      cb: () => el.classList.add('is-visible'),
      margin,
    })
    observer.observe(el)

    return () => {
      observer.unobserve(el)
      observed.delete(el)
    }
  }, [margin])

  return ref
}
