import { useState, useCallback, useEffect } from 'react'
import { FORM_STEPS } from './formSteps'

const STORAGE_KEY = 'inmo-form-data'

export interface InmoFormData {
  [key: string]: string | string[] | boolean
}

function loadFromStorage(): { data: InmoFormData; step: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { data: {}, step: 0 }
}

function saveToStorage(data: InmoFormData, step: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }))
  } catch { /* ignore */ }
}

export function clearFormStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function useInmoForm() {
  const [currentStep, setCurrentStep] = useState(() => loadFromStorage().step)
  const [formData, setFormData] = useState<InmoFormData>(() => loadFromStorage().data)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [completed, setCompleted] = useState(false)

  const totalSteps = FORM_STEPS.length
  const step = FORM_STEPS[currentStep]
  const isLastStep = currentStep >= totalSteps - 1

  useEffect(() => {
    saveToStorage(formData, currentStep)
  }, [formData, currentStep])

  const setValue = useCallback((field: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleMultiValue = useCallback((field: string, opt: string, exclusiveOption?: string) => {
    setFormData((prev) => {
      const raw = prev[field]
      const current: string[] = Array.isArray(raw)
        ? raw
        : typeof raw === 'string' && raw.trim()
          ? [raw]
          : []

      let next: string[]
      if (exclusiveOption && opt === exclusiveOption) {
        next = current.includes(opt) ? [] : [opt]
      } else if (exclusiveOption && current.includes(exclusiveOption)) {
        next = [opt]
      } else if (current.includes(opt)) {
        next = current.filter((v) => v !== opt)
      } else {
        next = [...current, opt]
      }
      return { ...prev, [field]: next }
    })
  }, [])

  const getValue = useCallback((field: string): string => {
    const v = formData[field]
    return typeof v === 'string' ? v : ''
  }, [formData])

  const getMultiValue = useCallback((field: string): string[] => {
    const v = formData[field]
    if (Array.isArray(v)) return v
    if (typeof v === 'string' && v.trim()) return [v]
    return []
  }, [formData])

  const getCheckbox = useCallback((stepId: string): boolean => {
    return formData[`${stepId}_checkbox`] === true
  }, [formData])

  const canAdvance = useCallback((): boolean => {
    if (!step) return false
    if (step.type === 'section-header') return true

    const val = formData[step.dbField]

    if (step.hasCheckbox && !formData[`${step.id}_checkbox`]) return false

    if (step.required) {
      if (step.type === 'chips-multi') {
        return Array.isArray(val) && val.length > 0
      }
      return typeof val === 'string' && val.trim().length > 0
    }
    return true
  }, [step, formData])

  const goNext = useCallback(() => {
    if (!canAdvance()) return false
    if (isLastStep) {
      setCompleted(true)
      return true
    }

    let nextIdx = currentStep + 1

    if (FORM_STEPS[nextIdx]?.type === 'section-header') {
      setDirection('next')
      setCurrentStep(nextIdx)
      setTimeout(() => {
        if (nextIdx + 1 < totalSteps) {
          setCurrentStep(nextIdx + 1)
        }
      }, 1200)
      return true
    }

    const tipoInmueble = formData['tipo_inmueble']
    const skipTorre = tipoInmueble === 'Apartamento en edificio único' || tipoInmueble === 'Casa sola'
    if (FORM_STEPS[nextIdx]?.id === 'torre' && skipTorre) {
      setFormData((prev) => ({ ...prev, torre: 'Torre 1' }))
      nextIdx += 1
    }

    const zonaVal = formData['zonas']
    const hasParqueadero = Array.isArray(zonaVal) && zonaVal.includes('Parqueadero')
    if (FORM_STEPS[nextIdx]?.id === 'parqueaderos' && !hasParqueadero) {
      nextIdx = FORM_STEPS.findIndex((s) => s.id === 'precio_venta')
    }

    setDirection('next')
    setCurrentStep(nextIdx)
    return true
  }, [canAdvance, currentStep, isLastStep, totalSteps, formData])

  const goPrev = useCallback(() => {
    if (currentStep <= 0) return
    let prevIdx = currentStep - 1

    if (FORM_STEPS[prevIdx]?.type === 'section-header') {
      prevIdx = prevIdx - 1
    }

    if (prevIdx < 0) prevIdx = 0

    const tipoInmueble = formData['tipo_inmueble']
    const skipTorre = tipoInmueble === 'Apartamento en edificio único' || tipoInmueble === 'Casa sola'
    if (FORM_STEPS[prevIdx]?.id === 'torre' && skipTorre) {
      prevIdx -= 1
    }

    if (prevIdx < 0) prevIdx = 0

    const zonaVal = formData['zonas']
    const hasParqueadero = Array.isArray(zonaVal) && zonaVal.includes('Parqueadero')
    if (FORM_STEPS[prevIdx]?.id === 'organizacion_parqueadero' && !hasParqueadero) {
      prevIdx = FORM_STEPS.findIndex((s) => s.id === 'zonas')
    }

    setDirection('prev')
    setCurrentStep(prevIdx)
  }, [currentStep, formData])

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100)

  return {
    currentStep,
    step,
    totalSteps,
    isLastStep,
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
  }
}
