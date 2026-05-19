import { useState, useEffect, useId } from 'react'
import { saveSaleStage } from '../../lib/storage-sync'
import './VsaProgress.css'

export interface ProgressStep {
  id: number
  label: string
  shortTitle?: string
}

const DEFAULT_STEPS: ProgressStep[] = [
  {
    id: 1,
    shortTitle: 'Precio y difusión',
    label: 'Estoy definiendo un precio y promocionando la casa',
  },
  {
    id: 2,
    shortTitle: 'Visitas y negociación',
    label: 'Estoy recibiendo visitas y negociando',
  },
  {
    id: 3,
    shortTitle: 'Documentos y pago',
    label: 'Estoy alistando documentos para el pago',
  },
  {
    id: 4,
    shortTitle: 'Entrega',
    label: 'Estoy alistando el inmueble para entrega',
  },
]

function readSavedStage(storageKey: string, validIds: number[]): number {
  const saved = localStorage.getItem(storageKey)
  if (saved === null) return 0
  const n = parseInt(saved, 10)
  return validIds.includes(n) ? n : 0
}

interface VsaProgressProps {
  steps?: ProgressStep[]
  storageKey?: string
  title?: string
  subtitle?: string
  scrollTarget?: string
  dispatchEvent?: boolean
}

export function VsaProgress({
  steps = DEFAULT_STEPS,
  storageKey = 'vsa-user-stage',
  title = '¿En qué momento de tu venta estás?',
  subtitle = 'Elige la opción que mejor describe tu situación hoy. No hay un orden obligatorio: puedes cambiarla cuando quieras.',
  scrollTarget = 'guia-etapas',
  dispatchEvent = true,
}: VsaProgressProps) {
  const groupId = useId()
  const stepIds = steps.map((s) => s.id)

  const [activeStep, setActiveStep] = useState(() => readSavedStage(storageKey, stepIds))
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (activeStep < 1) return

    saveSaleStage(storageKey, activeStep)
    if (dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent('vsa-stage-change', { detail: { stage: activeStep, storageKey } })
      )
    }
  }, [activeStep, storageKey, dispatchEvent])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ stage?: number; storageKey?: string }>).detail ?? {}
      const eventKey = detail.storageKey ?? 'vsa-user-stage'
      if (eventKey !== storageKey) return
      const stage = detail.stage
      if (typeof stage === 'number' && stepIds.includes(stage)) {
        setActiveStep(stage)
      }
    }
    window.addEventListener('vsa-stage-change', handler)
    return () => window.removeEventListener('vsa-stage-change', handler)
  }, [storageKey, stepIds])

  useEffect(() => {
    if (!feedback) return
    const t = window.setTimeout(() => setFeedback(null), 4500)
    return () => window.clearTimeout(t)
  }, [feedback])

  function handleSelect(step: ProgressStep) {
    setActiveStep(step.id)
    setFeedback(`Te mostramos contenido para: ${step.shortTitle ?? step.label}`)

    if (scrollTarget) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTarget)
        if (el) {
          const navHeight =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
              10
            ) || 78
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 20
          window.scrollTo({ top, behavior: 'smooth' })
        }
      })
    }
  }

  return (
    <section className="vsa-progress" id="como-vas-venta">
      <div className="vsa-progress__inner">
        <h2 id={`${groupId}-title`} className="vsa-progress__title">
          {title}
        </h2>
        <p id={`${groupId}-subtitle`} className="vsa-progress__subtitle">
          {subtitle}
        </p>

        <div
          className="vsa-progress__cards"
          role="radiogroup"
          aria-labelledby={`${groupId}-title`}
          aria-describedby={`${groupId}-subtitle`}
        >
          {steps.map((step) => {
            const isSelected = activeStep === step.id
            const displayTitle = step.shortTitle ?? step.label

            return (
              <button
                key={step.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`vsa-progress__card${isSelected ? ' vsa-progress__card--selected' : ''}`}
                onClick={() => handleSelect(step)}
              >
                <span className="vsa-progress__card-radio" aria-hidden="true">
                  <span className="vsa-progress__card-radio-dot" />
                </span>
                <span className="vsa-progress__card-body">
                  <span className="vsa-progress__card-meta">
                    <span className="vsa-progress__card-num">Etapa {step.id}</span>
                    {isSelected && (
                      <span className="vsa-progress__card-badge">Tu etapa actual</span>
                    )}
                  </span>
                  <span className="vsa-progress__card-title">{displayTitle}</span>
                  <span className="vsa-progress__card-desc">{step.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {activeStep === 0 && (
          <p className="vsa-progress__hint">Selecciona una opción para personalizar la guía ↓</p>
        )}

        {feedback && (
          <p className="vsa-progress__feedback" role="status" aria-live="polite">
            {feedback}
          </p>
        )}
      </div>
    </section>
  )
}
