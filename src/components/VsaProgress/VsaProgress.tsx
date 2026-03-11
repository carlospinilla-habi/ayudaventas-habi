import { useState, useEffect } from 'react'
import './VsaProgress.css'

export interface ProgressStep {
  id: number
  label: string
}

const DEFAULT_STEPS: ProgressStep[] = [
  { id: 1, label: 'Precio y Difusión' },
  { id: 2, label: 'Visitas y Negociación' },
  { id: 3, label: 'Documentos y Pago' },
  { id: 4, label: 'Entrega' },
]

function getStatusText(stepId: number, activeStep: number) {
  if (stepId < activeStep) return 'Completado'
  if (stepId === activeStep) return 'En progreso'
  return 'Bloqueado'
}

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 7V4.5C4.5 2.567 6.067 1 8 1C9.933 1 11.5 2.567 11.5 4.5V7M4 7H12C13.105 7 14 7.895 14 9V13C14 14.105 13.105 15 12 15H4C2.895 15 2 14.105 2 13V9C2 7.895 2.895 7 4 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

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
  title = '¿Cómo vas con tu venta?',
  subtitle = 'Marca cada etapa a medida que avanzas y nosotros te mostramos qué sigue.',
  scrollTarget = 'guia-etapas',
  dispatchEvent = true,
}: VsaProgressProps) {
  const [activeStep, setActiveStep] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? parseInt(saved, 10) : 1
  })

  useEffect(() => {
    localStorage.setItem(storageKey, String(activeStep))
    if (dispatchEvent) {
      window.dispatchEvent(new CustomEvent('vsa-stage-change', { detail: { stage: activeStep } }))
    }
  }, [activeStep, storageKey, dispatchEvent])

  function handleStepClick(stepId: number) {
    setActiveStep(stepId)

    if (scrollTarget) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollTarget)
        if (el) {
          const navHeight = 78
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 20
          window.scrollTo({ top, behavior: 'smooth' })
        }
      })
    }
  }

  return (
    <section className="vsa-progress">
      <div className="vsa-progress__inner">
        <h2 className="vsa-progress__title">{title}</h2>
        <p className="vsa-progress__subtitle">{subtitle}</p>

        <div className="vsa-progress__track">
          <div className="vsa-progress__steps">
            {steps.map((step, i) => {
              const isActive = step.id === activeStep
              const isCompleted = step.id < activeStep
              const isLocked = step.id > activeStep
              const isLast = step.id === steps[steps.length - 1].id
              const status = getStatusText(step.id, activeStep)

              return (
                <div key={step.id} className="vsa-progress__step-group">
                  <button
                    type="button"
                    className="vsa-progress__step"
                    onClick={() => handleStepClick(step.id)}
                    aria-label={`${step.label} — ${status}`}
                  >
                    <div
                      className={`vsa-progress__circle ${
                        isActive ? 'vsa-progress__circle--active' :
                        isCompleted ? 'vsa-progress__circle--completed' :
                        'vsa-progress__circle--locked'
                      }`}
                    >
                      {isCompleted && <CheckIcon />}
                      {isActive && !isLast && (
                        <span className="vsa-progress__circle-num">{step.id}</span>
                      )}
                      {isActive && isLast && <CheckIcon />}
                      {isLocked && !isLast && <LockIcon />}
                      {isLocked && isLast && (
                        <span className="vsa-progress__circle-check-dim"><CheckIcon /></span>
                      )}
                    </div>

                    <div className="vsa-progress__label-wrap">
                      <span className="vsa-progress__label">{step.label}</span>
                      <span className={`vsa-progress__status ${
                        isActive ? 'vsa-progress__status--active' :
                        isCompleted ? 'vsa-progress__status--completed' : ''
                      }`}>
                        {status}
                      </span>
                    </div>
                  </button>

                  {i < steps.length - 1 && (
                    <div className={`vsa-progress__separator ${
                      step.id < activeStep ? 'vsa-progress__separator--done' : ''
                    }`}>
                      <svg className="vsa-progress__separator-line" viewBox="0 0 104 2" fill="none" preserveAspectRatio="none">
                        <line x1="0" y1="1" x2="104" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6"/>
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
