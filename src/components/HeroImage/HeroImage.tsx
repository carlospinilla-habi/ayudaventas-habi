import './HeroImage.css'

export type HeroImageSection = '01' | '02' | '03' | '04'

interface HeroImageProps {
  src: string
  section?: HeroImageSection
}

export function HeroImage({ src, section = '02' }: HeroImageProps) {
  return (
    <div className={`hero-image hero-image--s${section}`}>
      <div className="hero-image__frame">
        <img src={src} alt="" className="hero-image__img" loading="eager" decoding="async" />
      </div>
    </div>
  )
}
