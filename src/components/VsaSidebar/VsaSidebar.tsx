import { useNavigate } from 'react-router-dom'
import './VsaSidebar.css'

const ICON_LIGHTNING = '/assets/6bcd3609af0841b23174cb50a20ff3abe9122f8a.svg'
const ICON_HOUSE = '/assets/9181246ffbe1ae1c81907fb9b93a7cbfad54a590.svg'
const ICON_GAVEL = '/assets/1310b413939ce95781b95c6a3f32181573aecf25.svg'

const CoffeeMugIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="28"
    height="30"
    viewBox="0 0 14 15.1667"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M7.16667 0C6.79847 0 6.5 0.298477 6.5 0.666667V3C6.5 3.3682 6.79847 3.66667 7.16667 3.66667C7.53487 3.66667 7.83333 3.3682 7.83333 3V0.666667C7.83333 0.298477 7.53487 0 7.16667 0ZM3.10653 15.0902C3.74767 15.1362 4.53613 15.1667 5.5 15.1667C6.46387 15.1667 7.25233 15.1362 7.89347 15.0902C9.4671 14.9774 10.5735 13.9291 10.886 12.5H11.3774C12.6456 12.5 13.8761 11.6159 13.9714 10.1926C13.989 9.93017 14 9.6423 14 9.33333C14 9.02437 13.989 8.7365 13.9714 8.47403C13.8761 7.05073 12.6456 6.16667 11.3774 6.16667H10.8315C10.703 5.5901 10.2517 5.1468 9.6389 5.056C8.9306 4.95107 7.6567 4.83333 5.5 4.83333C3.3433 4.83333 2.06939 4.95107 1.36109 5.056C0.686587 5.15593 0.20783 5.6829 0.139703 6.34457C0.0726267 6.9961 0 8.132 0 10C0 10.6971 0.0101133 11.2876 0.0262733 11.7863C0.0840433 13.5693 1.28088 14.9594 3.10653 15.0902ZM10.9603 7.83333C10.9841 8.4122 11 9.12597 11 10C11 10.2967 10.9982 10.5741 10.9948 10.8333H11.3774C11.931 10.8333 12.282 10.4758 12.3084 10.0813C12.3237 9.85333 12.3333 9.60267 12.3333 9.33333C12.3333 9.064 12.3237 8.81333 12.3084 8.58533C12.282 8.19083 11.931 7.83333 11.3774 7.83333H10.9603ZM3.83333 1.33333C3.83333 0.965143 4.1318 0.666667 4.5 0.666667C4.8682 0.666667 5.16667 0.965143 5.16667 1.33333V3.66667C5.16667 4.03487 4.8682 4.33333 4.5 4.33333C4.1318 4.33333 3.83333 4.03487 3.83333 3.66667V1.33333Z" fill="currentColor"/>
  </svg>
)

export type SidebarPage = 'sin-afan' | 'urgente' | 'cambiar' | 'legal'

interface SidebarItem {
  id: SidebarPage
  label: string
  icon?: string
  iconSize?: number
  route?: string
}

const NAV_ITEMS: SidebarItem[] = [
  { id: 'sin-afan', label: 'Vender sin afán', route: '/vender-sin-afan' },
  { id: 'urgente', icon: ICON_LIGHTNING, label: 'Urgente', iconSize: 32, route: '/vender-urgente' },
  { id: 'cambiar', icon: ICON_HOUSE, label: 'Cambiar de casa', iconSize: 24, route: '/cambiar-de-casa' },
  { id: 'legal', icon: ICON_GAVEL, label: 'Tema legal', iconSize: 24 },
]

interface VsaSidebarProps {
  activePage?: SidebarPage
}

export function VsaSidebar({ activePage = 'sin-afan' }: VsaSidebarProps) {
  const navigate = useNavigate()

  return (
    <aside className="vsa-sidebar" data-node-id="309:51585">
      <nav className="vsa-sidebar__icons" aria-label="Secciones de venta" data-node-id="309:51586">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activePage

          return (
            <button
              key={item.id}
              type="button"
              className={`vsa-sidebar__btn${isActive ? ' vsa-sidebar__btn--active' : ''}`}
              aria-label={item.label}
              title={item.label}
              onClick={() => {
                if (item.route && !isActive) navigate(item.route)
              }}
            >
              {item.id === 'sin-afan' ? (
                <CoffeeMugIcon className="vsa-sidebar__icon-svg" />
              ) : (
                <img
                  src={item.icon}
                  alt=""
                  className="vsa-sidebar__icon"
                  style={{ width: item.iconSize, height: item.iconSize }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
