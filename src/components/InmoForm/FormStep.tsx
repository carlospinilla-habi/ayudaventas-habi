import { useState, useRef, useEffect, useMemo } from 'react'
import type { FormStep as StepConfig } from './formSteps'
import { BARRIOS_POR_CIUDAD } from './formSteps'

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('es-CO')
}

interface FormStepProps {
  step: StepConfig
  value: string
  multiValue?: string[]
  conditionalValue?: string
  checkboxChecked?: boolean
  cityValue?: string
  onValue: (v: string) => void
  onMultiValue?: (v: string[]) => void
  onToggleMulti?: (opt: string) => void
  onConditionalValue?: (v: string) => void
  onCheckbox?: (v: boolean) => void
  onNext: () => void
}

const GRAVAMEN_OPTIONS = [
  'Hipoteca', 'Embargo', 'Patrimonio de familia',
  'Afectación a vivienda familiar', 'Otro',
]

export function FormStep({
  step,
  value,
  multiValue = [],
  conditionalValue = '',
  checkboxChecked = false,
  cityValue = '',
  onValue,
  onToggleMulti,
  onConditionalValue,
  onCheckbox,
  onNext,
}: FormStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      (step.type === 'text-input' || step.type === 'text-autocomplete') &&
      inputRef.current
    ) {
      const timer = setTimeout(() => inputRef.current?.focus(), 400)
      return () => clearTimeout(timer)
    }
  }, [step.id, step.type])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onNext()
    }
  }

  if (step.type === 'section-header') {
    return (
      <div className="inmo-step__section-header">
        <h2 className="inmo-step__section-title">{step.heading}</h2>
      </div>
    )
  }

  return (
    <div className="inmo-step">
      <div className="inmo-step__heading-wrap">
        {step.icon && (
          <div className="inmo-step__icon">
            <img src={step.icon} alt="" width={24} height={24} />
          </div>
        )}
        <h3 className="inmo-step__heading">{step.heading}</h3>
        {step.subheading && (
          <p className="inmo-step__subheading">{step.subheading}</p>
        )}
      </div>

      <div className="inmo-step__input-area">
        {step.type === 'text-input' && (
          <div className={`inmo-step__text-input-wrap ${step.prefix ? 'inmo-step__text-input-wrap--prefix' : ''}`}>
            {step.prefix && <span className="inmo-step__input-prefix">{step.prefix}</span>}
            <input
              ref={inputRef}
              className="inmo-step__text-input"
              type={step.inputType || 'text'}
              inputMode={step.numberFormat === 'currency' ? 'numeric' : undefined}
              placeholder={step.placeholder}
              value={step.numberFormat === 'currency' ? formatCurrency(value) : value}
              onChange={(e) => {
                if (step.numberFormat === 'currency') {
                  const raw = e.target.value.replace(/\D/g, '')
                  onValue(raw)
                } else {
                  onValue(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {step.type === 'text-autocomplete' && (
          <AutocompleteInput
            inputRef={inputRef}
            value={value}
            placeholder={step.placeholder || ''}
            cityValue={cityValue}
            optionsByCity={step.optionsByCity || BARRIOS_POR_CIUDAD}
            onChange={onValue}
            onKeyDown={handleKeyDown}
          />
        )}

        {step.type === 'dropdown' && (
          <div className="inmo-step__dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`inmo-step__dropdown-trigger ${value ? 'inmo-step__dropdown-trigger--filled' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{value || step.placeholder}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#3c83f6" strokeWidth="2"/>
                <path d="M8 10l4 4 4-4" stroke="#3c83f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && step.options && step.options.length > 0 && (
              <div className="inmo-step__dropdown-menu">
                {step.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`inmo-step__dropdown-item ${value === opt ? 'inmo-step__dropdown-item--selected' : ''}`}
                    onClick={() => {
                      onValue(opt)
                      setDropdownOpen(false)
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step.type === 'card-selector' && step.cardOptions && (
          <div className={`inmo-step__cards ${step.cardOptions.length === 2 ? 'inmo-step__cards--two' : ''}`}>
            {step.cardOptions.map((card) => (
              <button
                key={card.label}
                type="button"
                className={`inmo-step__card ${value === card.label ? 'inmo-step__card--selected' : ''}`}
                onClick={() => onValue(card.label)}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt=""
                    className="inmo-step__card-img"
                  />
                )}
                <span className="inmo-step__card-label">{card.label}</span>
              </button>
            ))}
          </div>
        )}

        {step.type === 'chips' && step.options && (
          <div className="inmo-step__chips">
            {step.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`inmo-step__chip ${value === opt ? 'inmo-step__chip--selected' : ''}`}
                onClick={() => onValue(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step.type === 'chips-multi' && step.options && (
          <div className="inmo-step__chips inmo-step__chips--wrap">
            {step.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`inmo-step__chip ${multiValue.includes(opt) ? 'inmo-step__chip--selected' : ''}`}
                onClick={() => {
                  if (onToggleMulti) {
                    onToggleMulti(opt)
                  }
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step.type === 'chips-conditional' && step.options && (
          <div className="inmo-step__conditional">
            <div className="inmo-step__chips">
              {step.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`inmo-step__chip ${value === opt ? 'inmo-step__chip--selected' : ''}`}
                  onClick={() => onValue(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {value === 'Sí' && (
              <ConditionalDropdown
                value={conditionalValue}
                onChange={onConditionalValue || (() => {})}
                placeholder="Seleccione el tipo de gravamen"
                options={GRAVAMEN_OPTIONS}
              />
            )}
          </div>
        )}
      </div>

      {step.hasCheckbox && (
        <label className="inmo-step__checkbox">
          <input
            type="checkbox"
            checked={checkboxChecked}
            onChange={(e) => onCheckbox?.(e.target.checked)}
          />
          <span className="inmo-step__checkbox-box" />
          <span className="inmo-step__checkbox-text">
            Acepto los{' '}
            <a href="https://habi.co/terminosycondiciones" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
            {' '}y la{' '}
            <a href="https://habi.co/terminosycondiciones-1-0" target="_blank" rel="noopener noreferrer">política de tratamientos de datos</a>
          </span>
        </label>
      )}
    </div>
  )
}

function AutocompleteInput({
  inputRef,
  value,
  placeholder,
  cityValue,
  optionsByCity,
  onChange,
  onKeyDown,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  value: string
  placeholder: string
  cityValue: string
  optionsByCity: Record<string, string[]>
  onChange: (v: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const cityOptions = optionsByCity[cityValue] || []
    if (!value.trim()) return cityOptions
    const lower = value.toLowerCase()
    return cityOptions.filter((o) => o.toLowerCase().includes(lower))
  }, [cityValue, optionsByCity, value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const hasSuggestions = suggestions.length > 0

  return (
    <div className="inmo-step__autocomplete" ref={wrapRef}>
      <input
        ref={inputRef}
        className="inmo-step__text-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
          }
          onKeyDown(e)
        }}
      />
      {open && hasSuggestions && (
        <div className="inmo-step__autocomplete-menu">
          {suggestions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`inmo-step__dropdown-item ${value === opt ? 'inmo-step__dropdown-item--selected' : ''}`}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ConditionalDropdown({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: string[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="inmo-step__dropdown inmo-step__dropdown--conditional" ref={ref}>
      <button
        type="button"
        className={`inmo-step__dropdown-trigger ${value ? 'inmo-step__dropdown-trigger--filled' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{value || placeholder}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="11" stroke="#3c83f6" strokeWidth="2"/>
          <path d="M8 10l4 4 4-4" stroke="#3c83f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="inmo-step__dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`inmo-step__dropdown-item ${value === opt ? 'inmo-step__dropdown-item--selected' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
