import { useEffect, useCallback, useState } from 'react'
import { FormStep } from './FormStep'
import { useInmoForm, clearFormStorage } from './useInmoForm'
import { syncInmoFormSubmission } from '../../lib/supabase'
import './InmoForm.css'

const SUCCESS_IMAGE = '/assets/form-assets/4ddb38c763c8895e78654a7dde5edcc4d1beafd1.png'

interface InmoFormProps {
  open: boolean
  onClose: () => void
}

export default function InmoForm({ open, onClose }: InmoFormProps) {
  const {
    currentStep,
    step,
    totalSteps,
    completed,
    direction,
    formData,
    progressPercent,
    setValue,
    toggleMultiValue,
    getValue,
    getMultiValue,
    getCheckbox,
    canAdvance,
    goNext,
    goPrev,
    setCompleted,
  } = useInmoForm()

  const [animating, setAnimating] = useState(false)
  const [slideClass, setSlideClass] = useState('inmo-form__step--active')
  const handleNext = useCallback(() => {
    if (animating || !canAdvance()) return

    setAnimating(true)
    setSlideClass(
      direction === 'next' ? 'inmo-form__step--exit-up' : 'inmo-form__step--exit-down'
    )

    const isLast = currentStep >= totalSteps - 1

    if (isLast) {
      syncInmoFormSubmission(formData).catch((e) =>
        console.warn('[InmoForm] submission error:', e)
      )
    }

    setTimeout(() => {
      goNext()
      setSlideClass('inmo-form__step--enter-from-below')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideClass('inmo-form__step--active')
          setTimeout(() => setAnimating(false), 400)
        })
      })
    }, 300)
  }, [animating, canAdvance, goNext, direction, currentStep, totalSteps, formData])

  const handlePrev = useCallback(() => {
    if (animating || currentStep <= 0) return

    setAnimating(true)
    setSlideClass('inmo-form__step--exit-down')

    setTimeout(() => {
      goPrev()
      setSlideClass('inmo-form__step--enter-from-above')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideClass('inmo-form__step--active')
          setTimeout(() => setAnimating(false), 400)
        })
      })
    }, 300)
  }, [animating, currentStep, goPrev])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !animating && !completed) {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'ArrowUp' || (e.key === 'Backspace' && document.activeElement?.tagName !== 'INPUT')) {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, animating, completed, handleNext, handlePrev])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFinish = () => {
    clearFormStorage()
    setCompleted(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="inmo-form__overlay">
      <div className="inmo-form__modal">
        {/* Navbar */}
        <header className="inmo-form__header">
          <div className="inmo-form__brand">
            <div className="inmo-form__logo">
              <div className="inmo-form__logo-bg">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 3C9.716 3 3 9.716 3 18s6.716 15 15 15 15-6.716 15-15S26.284 3 18 3z" fill="white" opacity=".2"/>
                  <text x="10" y="24" fill="white" fontFamily="Poppins" fontWeight="700" fontSize="16">H</text>
                </svg>
              </div>
            </div>
            <div className="inmo-form__brand-text">
              <span className="inmo-form__brand-name">
                Ayuda<span className="inmo-form__brand-accent">ventas</span>
              </span>
              <span className="inmo-form__brand-sub">habi.co.</span>
            </div>
          </div>
          <button
            type="button"
            className="inmo-form__close-btn"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        {/* Progress bar */}
        <div className="inmo-form__progress">
          <div
            className="inmo-form__progress-fill"
            style={{ width: completed ? '100%' : `${progressPercent}%` }}
          />
        </div>

        {/* Content area */}
        <div className="inmo-form__content">
          {completed ? (
            <div className="inmo-form__success">
              <img
                src={SUCCESS_IMAGE}
                alt=""
                className="inmo-form__success-img"
                width={148}
                height={148}
              />
              <h2 className="inmo-form__success-heading">
                ¡Listo! tenemos la información necesaria para proponerte como vender tu vivienda
              </h2>
              <p className="inmo-form__success-desc">
                Antes de las próximas 48 horas recibirás un mensaje de nuestro equipo con noticias sobre tu interés de venta. Está muy atento a nuestra llamada o mensaje de WhatsApp para contarte detalles de la oferta.
              </p>
              <button
                type="button"
                className="inmo-form__success-btn"
                onClick={handleFinish}
              >
                Volver al ayudaventas
              </button>
            </div>
          ) : step ? (
            <div className={`inmo-form__step-wrap ${slideClass}`}>
              <FormStep
                key={step.id}
                step={step}
                value={getValue(step.dbField)}
                multiValue={getMultiValue(step.dbField)}
                conditionalValue={step.conditionalField ? getValue(step.conditionalField) : ''}
                checkboxChecked={getCheckbox(step.id)}
                cityValue={getValue('ciudad')}
                onValue={(v) => setValue(step.dbField, v)}
                onMultiValue={(v) => setValue(step.dbField, v)}
                onToggleMulti={(opt) => toggleMultiValue(step.dbField, opt, step.exclusiveOption)}
                onConditionalValue={(v) => step.conditionalField && setValue(step.conditionalField, v)}
                onCheckbox={(v) => setValue(`${step.id}_checkbox`, v)}
                onNext={handleNext}
              />

              {/* Navigation buttons */}
              <div className="inmo-form__nav">
                {currentStep > 0 && (
                  <button
                    type="button"
                    className="inmo-form__nav-prev"
                    onClick={handlePrev}
                    disabled={animating}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M15 10H5M5 10l5-5M5 10l5 5"/>
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className={`inmo-form__nav-next ${!canAdvance() ? 'inmo-form__nav-next--disabled' : ''}`}
                  onClick={handleNext}
                  disabled={animating || !canAdvance()}
                >
                  <span>Siguiente</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 10h10M15 10l-5 5M15 10l-5-5"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
