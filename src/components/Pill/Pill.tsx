import './Pill.css'

export type PillEstado = 'sin-afan' | 'urgente' | 'cambio' | 'legal'
export type PillMode = 'light' | 'dark'

const ICONS: Record<PillEstado, Record<PillMode, string>> = {
  'sin-afan': {
    light: '/assets/31d9f6482640068f17d30c7ad16c747c2fd706fb.svg',
    dark: '/assets/pills/24bae02de3306c32c0c564c366d41117a4287a39.svg',
  },
  urgente: {
    light: '/assets/6bcd3609af0841b23174cb50a20ff3abe9122f8a.svg',
    dark: '/assets/pills/e4288b2a3aef3d6c25012dd22ed46d631e83df2f.svg',
  },
  cambio: {
    light: '/assets/9181246ffbe1ae1c81907fb9b93a7cbfad54a590.svg',
    dark: '/assets/pills/c697bfd3e5b56727ff8ed9be1845ae375083b218.svg',
  },
  legal: {
    light: '/assets/1310b413939ce95781b95c6a3f32181573aecf25.svg',
    dark: '/assets/pills/5f828c1fbf8b385ff55aeef58b50e27054eb63ee.svg',
  },
}

const LABELS: Record<PillEstado, string> = {
  'sin-afan': 'Vender sin afán',
  urgente: 'Vender Urgente',
  cambio: 'Cambiar de casa',
  legal: 'Asunto legal',
}

interface PillProps {
  estado: PillEstado
  mode?: PillMode
  label?: string
  className?: string
}

export function Pill({ estado, mode = 'light', label, className }: PillProps) {
  const icon = ICONS[estado][mode]
  const text = label ?? LABELS[estado]

  return (
    <span className={`pill pill--${mode}${className ? ` ${className}` : ''}`}>
      <img src={icon} alt="" className="pill__icon" />
      <span className="pill__text">{text}</span>
    </span>
  )
}
