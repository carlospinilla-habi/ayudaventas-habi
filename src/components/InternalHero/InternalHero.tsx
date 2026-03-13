import type { ReactNode } from 'react'
import { HeroImage } from '../HeroImage/HeroImage'
import type { HeroImageSection } from '../HeroImage/HeroImage'
import './InternalHero.css'

const SealCheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.134 2.287a2.667 2.667 0 0 1 3.732 0l1.475 1.437a2.667 2.667 0 0 0 2.12.727l2.053-.214a2.667 2.667 0 0 1 2.905 2.25l.354 2.037a2.667 2.667 0 0 0 1.272 1.827l1.734 1.067a2.667 2.667 0 0 1 .92 3.56l-1.004 1.77a2.667 2.667 0 0 0-.267 2.198l.598 1.973a2.667 2.667 0 0 1-1.723 3.272l-1.977.593a2.667 2.667 0 0 0-1.694 1.413l-.868 1.84a2.667 2.667 0 0 1-3.452 1.24l-1.852-.862a2.667 2.667 0 0 0-2.204 0l-1.852.862a2.667 2.667 0 0 1-3.452-1.24l-.868-1.84a2.667 2.667 0 0 0-1.694-1.413l-1.977-.593a2.667 2.667 0 0 1-1.723-3.272l.598-1.973a2.667 2.667 0 0 0-.267-2.198l-1.004-1.77a2.667 2.667 0 0 1 .92-3.56l1.734-1.067a2.667 2.667 0 0 0 1.272-1.827l.354-2.037a2.667 2.667 0 0 1 2.905-2.25l2.053.214a2.667 2.667 0 0 0 2.12-.727l1.475-1.437Z" fill="#7955f9"/>
    <path d="M11.5 16.5L14.5 19.5L20.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export interface HeroBenefit {
  text: string | ReactNode
}

export interface HeroCTA {
  label: string
  variant: 'primary' | 'outline'
  href?: string
  onClick?: () => void
}

export interface HeroTip {
  title: string
  description: string | ReactNode
}

export interface InternalHeroProps {
  pill: ReactNode
  title: ReactNode
  subtitle: string
  description: string
  ctas: HeroCTA[]
  benefits: HeroBenefit[]
  tip?: HeroTip
  heroImage: string
  heroSection?: HeroImageSection
}

const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

export function InternalHero({
  pill,
  title,
  subtitle,
  description,
  ctas,
  benefits,
  tip,
  heroImage,
  heroSection,
}: InternalHeroProps) {
  return (
    <section className="int-hero" aria-label={typeof title === 'string' ? title : undefined}>
      <div className="int-hero__bg-gradient" />

      <div className="int-hero__center">
        <HeroImage src={heroImage} section={heroSection} />
      </div>

      <div className="int-hero__container">
        <div className="int-hero__content">
          <div className="int-hero__layout">
            <div className="int-hero__left">
              <div className="int-hero__text-section">
                {pill}

                <h1 className="int-hero__title">{title}</h1>
                <p className="int-hero__subtitle">{subtitle}</p>
              </div>

              <div className="int-hero__desc-block">
                <p className="int-hero__desc">{description}</p>
              </div>

              <div className="int-hero__cta-wrap">
                {ctas.map((cta, i) =>
                  cta.variant === 'primary' ? (
                    <button
                      key={i}
                      type="button"
                      className="int-hero__cta"
                      onClick={cta.onClick}
                    >
                      <span className="int-hero__cta-label">{cta.label}</span>
                      <span className="int-hero__cta-icon-wrap">
                        <img src={ARROW_ICON} alt="" width={24} height={24} />
                      </span>
                    </button>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      className="int-hero__cta-outline"
                      onClick={cta.onClick}
                    >
                      {cta.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="int-hero__right">
              <div className="int-hero__benefits">
                {benefits.map((benefit, i) => (
                  <div key={i}>
                    <div className="int-hero__benefit">
                      <span className="int-hero__benefit-icon"><SealCheckIcon /></span>
                      <p className="int-hero__benefit-text">{benefit.text}</p>
                    </div>
                    {i < benefits.length - 1 && <div className="int-hero__benefit-divider" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {tip && (
            <div className="int-hero__tip">
              <p className="int-hero__tip-title">{tip.title}</p>
              <div className="int-hero__tip-text">{tip.description}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
