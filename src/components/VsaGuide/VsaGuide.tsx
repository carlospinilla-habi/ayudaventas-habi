import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { saveChecklistProgress } from '../../lib/storage-sync'
import './VsaGuide.css'

const FichaCreator = lazy(() => import('../FichaCreator/FichaCreator'))

const TABS = [
  { id: 'precio', label: '1. Precio y Difusión' },
  { id: 'visitas', label: '2. Visitas y Negociación' },
  { id: 'documentos', label: '3. Documentos y Pago' },
  { id: 'entrega', label: '4. Entrega' },
]

const STAGE_TO_TAB: Record<number, string> = { 1: 'precio', 2: 'visitas', 3: 'documentos', 4: 'entrega' }

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vsa-guide__btn-arrow-icon">
    <path d="M15.2929 7.70711C14.9024 7.31658 14.9024 6.68342 15.2929 6.29289C15.6834 5.90237 16.3166 5.90237 16.7071 6.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L16.7071 17.7071C16.3166 18.0976 15.6834 18.0976 15.2929 17.7071C14.9024 17.3166 14.9024 16.6834 15.2929 16.2929L18.5858 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H18.5858L15.2929 7.70711Z" fill="white"/>
  </svg>
)

interface ChecklistItem {
  label: string
  hint?: string
}

interface TipListItem {
  text: string
  type: 'do' | 'dont'
}

interface PortalCard {
  recommended?: boolean
  headerText?: string
  title: string
  desc: string
  linkText: string
  linkHref: string
}

interface GuideTipItem {
  label: string
  hint?: string
}

interface GuideTipGroup {
  header: string
  headerIcon?: 'phone-bubble' | 'calendar-check'
  items: GuideTipItem[]
}

interface ScenarioCard {
  icon: 'arrow-down' | 'arrow-right-left' | 'dollar-check'
  title: string
  body: string
}

interface StepExpandedContent {
  tipIcon?: 'dollar' | 'memo' | 'users' | 'phone' | 'star' | 'hearts' | 'dollar-purple' | 'doc-edit'
  tipTitle: string
  tipBody: string
  goldenRule: string
  checklist: ChecklistItem[]
  cta?: { label: string; href: string }
  externalLinks?: { label: string; href: string }[]
  photoTips?: { title: string; items: TipListItem[] }
  darkCta?: { title: string; desc: string; label: string; href: string }
  portalCards?: PortalCard[]
  guideTips?: GuideTipGroup | GuideTipGroup[]
  scenarioCards?: { header: string; cards: ScenarioCard[] }
  nextStageCta?: { label: string; stageId: string }
}

interface StepItem {
  number: string
  title: string
  description: string
  expanded?: StepExpandedContent
}

function getChecklist(stepNumber: string, length: number): boolean[] {
  try {
    const saved = localStorage.getItem(`vsa-checklist-${stepNumber}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length === length) return parsed
    }
  } catch { /* ignore */ }
  return Array(length).fill(false)
}

function saveChecklist(stepNumber: string, checks: boolean[]) {
  saveChecklistProgress(stepNumber, checks)
}

const STEPS_BY_TAB: Record<string, { etapa: string; title: string; quote: string; quoteDesc: string; steps: StepItem[] }> = {
  precio: {
    etapa: 'Etapa 1 de 4',
    title: 'Precio y difusión',
    quote: 'La base de todo. Un buen precio + buena exposición = venta exitosa.',
    quoteDesc: 'Esta es la etapa más crítica. El <strong>80% del éxito de una venta</strong> se decide aquí. Un precio equivocado al inicio puede costarte meses y dinero.',
    steps: [
      {
        number: '1.1',
        title: 'Define el precio',
        description: 'El precio correcto, ni más ni menos.',
        expanded: {
          tipTitle: 'Poner el precio correcto es un arte y una ciencia.',
          tipBody: 'Muchos vendedores piden demasiado y su casa se queda meses sin mover. Otros piden muy poco y dejan plata sobre la mesa. Puedes usar Habimetro gratis para saber cuanto vale tu casa.',
          goldenRule: '<strong>La regla de oro:</strong> El mercado siempre tiene la razón. Investiga casas similares que se hayan vendido (no las que están en venta) en tu zona.',
          checklist: [
            { label: 'Busca 5 casas similares vendidas en tu zona', hint: '(En los últimos 3 meses)' },
            { label: 'Anota el precio por m² y calcula el promedio' },
            { label: 'Ajusta según el estado de tu casa', hint: '(Remodelada suma, descuidada resta)' },
            { label: 'Considera el piso, la vista, el parqueadero y zonas comunes' },
            { label: 'Consulta el avalúo catastral', hint: '(Pero no te guíes solo por él)' },
            { label: 'Define un precio "de venta" lo que vas a pedir y un precio mínimo aceptable que negociarías.' },
          ],
          cta: { label: 'Consultar el precio de mi casa', href: '#habi-habimetro' },
          externalLinks: [
            { label: 'Metrocuadrado', href: 'https://www.metrocuadrado.com' },
            { label: 'Fincaraiz', href: 'https://www.fincaraiz.com.co' },
            { label: 'Índice DANE', href: 'https://www.dane.gov.co' },
          ],
        },
      },
      {
        number: '1.2',
        title: 'Crea la ficha de tu casa',
        description: 'Un documento con la información de tu propiedad bien organizada. La primera impresión lo es todo.',
        expanded: {
          tipIcon: 'memo',
          tipTitle: 'Tu ficha es tu vendedor las 24 horas.',
          tipBody: 'Tiene que enamorar a quien la vea y responder todas las preguntas antes de que las hagan. Llena los datos, sube tus fotos y descarga una ficha lista para compartir donde quieras.',
          goldenRule: '<strong>Dato importante:</strong> Las fichas con fotos profesionales se venden hasta <strong>3x más rápido</strong>. Vale la pena invertir en esto.',
          checklist: [
            { label: 'Fotos de alta calidad', hint: '(mínimo 15, incluyendo fachada, sala, cocina, cuartos, baños y zonas comunes)' },
            { label: 'Descripción clara: # habitaciones, baños, m², estrato, piso' },
            { label: 'Descripción del barrio y puntos cercanos', hint: '(metro, colegios, comercio)' },
            { label: 'Valor de administración, parqueaderos, depósito' },
            { label: 'Menciona remodelaciones recientes o características especiales' },
            { label: 'Precio y condiciones de negociación' },
          ],
          cta: { label: 'Crear la ficha de mi casa', href: '#crear-ficha' },
          photoTips: {
            title: 'Tips de foto que marcan la diferencia',
            items: [
              { text: 'Recoge todo antes de fotografiar', type: 'do' },
              { text: 'Abre cortinas y enciende luces', type: 'do' },
              { text: 'Fotografía desde las esquinas para dar amplitud', type: 'do' },
              { text: 'Evita selfies y fotos movidas', type: 'dont' },
              { text: 'Nunca fotos de noche sin iluminación especial', type: 'dont' },
              { text: 'No dejes ropa, platos o desorden visible', type: 'dont' },
            ],
          },
        },
      },
      {
        number: '1.3',
        title: 'Compártelo con tus amigos',
        description: 'Tu red es tu primer mercado',
        expanded: {
          tipIcon: 'users',
          tipTitle: 'Tu red es tu primer mercado',
          tipBody: 'El 30% de las ventas de casas en Colombia ocurren por referidos. Alguien en tu círculo, o alguien que conocen ellos, puede ser tu comprador.',
          goldenRule: '<strong>Tip importante:</strong> adjunta siempre la ficha de tu casa. Un mensaje con texto es fácil de ignorar. Uno con una ficha bonita y fotos de calidad genera el doble de respuestas. <a href="#crear-ficha" class="vsa-guide__expanded-tip-link">Ir a crear mi ficha</a>',
          checklist: [
            { label: 'Publica en tu estado de WhatsApp con foto + precio' },
            { label: 'Comparte en grupos de WhatsApp del barrio, colegio, trabajo' },
            { label: 'Publica en tu Facebook personal y en grupos locales' },
            { label: 'Dile a tus vecinos — ellos pueden conocer a futuros vecinos' },
          ],
        },
      },
      {
        number: '1.4',
        title: 'Publícalo en portales',
        description: 'Llega a miles de compradores activos.',
        expanded: {
          tipIcon: 'users',
          tipTitle: 'Llega a miles de compradores activos',
          tipBody: 'Los portales inmobiliarios son donde los compradores serios buscan. Necesitas estar en los que más tráfico tienen.',
          goldenRule: '',
          checklist: [
            { label: 'Publicado en al menos 2 portales principales' },
            { label: 'Sube fotos en alta resolución' },
            { label: 'Precio actualizado y competitivo' },
            { label: 'Datos de contacto verificados y activos' },
            { label: 'Renovar el aviso cada 2 semanas para mantener visibilidad' },
          ],
          portalCards: [
            {
              recommended: true,
              title: 'Habi.co',
              desc: 'Millones de usuarios activos. La mayor audiencia de compradores en Colombia si vendes con el',
              linkText: 'servicio inmobiliario',
              linkHref: 'https://www.habi.co',
            },
            {
              headerText: 'www.metrocuadrado.com',
              title: 'Metrocuadrado',
              desc: 'Portal líder en Colombia con alta visibilidad.',
              linkText: 'Visitar sitio',
              linkHref: 'https://www.metrocuadrado.com',
            },
            {
              headerText: 'www.fincaraiz.com',
              title: 'Fincaraiz.com',
              desc: 'Gran base de usuarios buscadores activos.',
              linkText: 'Visitar sitio',
              linkHref: 'https://www.fincaraiz.com.co',
            },
          ],
        },
      },
      {
        number: '1.5',
        title: 'Atiende a los interesados',
        description: 'Tips de cómo responder bien y no perder al comprador correcto',
        expanded: {
          tipIcon: 'phone',
          tipTitle: 'Publicaste, te están escribiendo y llamando. ¡Bien! Pero ojo:',
          tipBody: 'La forma en que respondes puede hacer o deshacer una venta. Un comprador serio que no recibe respuesta rápida simplemente se va a ver la siguiente casa.',
          goldenRule: '<strong>Tip importante:</strong> Envía la ficha de tu casa apenas escriban — no esperes a que la pidan. <a class="vsa-guide__expanded-tip-link" href="#">Crear mi ficha</a>',
          checklist: [],
          guideTips: {
            header: 'Cómo atender una llamada de un interesado',
            headerIcon: 'phone-bubble',
            items: [
              { label: 'Contesta siempre con buen ánimo, aunque sea la décima llamada del día', hint: '(Aunque sea la décima llamada del día)' },
              { label: 'Confirma los datos básicos:', hint: '¿para quién es? ¿busca para vivir o para invertir?' },
              { label: 'Pregunta cuándo podría visitar', hint: 'Si tiene fecha en mente, es señal de que es serio' },
              { label: 'Resuelve sus dudas con honestidad.', hint: '(No exageres ni ocultes nada)' },
              { label: 'Si no puedes hablar en ese momento, envía un mensaje de WhatsApp en máximo 30 minutos' },
              { label: 'Anota nombre, teléfono y si quedó una visita agendada', hint: 'Haz seguimiento a los 2-3 días si no volvieron a escribir' },
            ],
          },
          nextStageCta: {
            label: 'Continuar a Visita y Negociación',
            stageId: 'visitas',
          },
        },
      },
    ],
  },
  visitas: {
    etapa: 'Etapa 2 de 4',
    title: 'Visitas y Negociación',
    quote: 'Tu casa en escena. Acá es donde los compradores se enamoran (o no).',
    quoteDesc: 'La mayoría de vendedores subestiman esta etapa. <strong>La forma en que muestras tu casa</strong> puede aumentar o reducir el precio ofrecido en millones.',
    steps: [
      {
        number: '2.1',
        title: 'Prepara tu casa para mostrar',
        description: 'Haz que tu casa se vea más grande, limpia y apetecible',
        expanded: {
          tipIcon: 'star',
          tipTitle: 'Home staging: Que se vea neutral, más grande, limpia y apetecible',
          tipBody: 'No tienes que remodelar ni gastar una fortuna. Pequeños detalles hacen una diferencia enorme en la percepción del comprador.',
          goldenRule: '<strong>Dato clave:</strong> Casas con buen "home staging" se venden en promedio <strong>17% más rápido y a mejores precios.</strong>',
          checklist: [
            { label: 'Limpieza profunda de toda la casa', hint: '(Incluyendo ventanas)' },
            { label: 'Despejar los espacios de objetos personales y exceso de muebles' },
            { label: 'Reparar grifos, bombillos fundidos, puertas que rozan' },
            { label: 'Pintar paredes si están muy deterioradas', hint: '(blanco o gris claro)' },
            { label: 'Organizar closets y depósitos', hint: '(los compradores siempre miran)' },
            { label: 'Eliminar olores', hint: '(mascota, cigarrillo, humedad)' },
          ],
        },
      },
      {
        number: '2.2',
        title: 'Organiza y maneja las visitas',
        description: 'Sé un anfitrión estratégico, no solo un guía turístico',
        expanded: {
          tipIcon: 'hearts',
          tipTitle: 'La visita es el momento de la verdad.',
          tipBody: 'Tienes entre 20 y 30 minutos para que el comprador se enamore de tu casa y se imagine viviendo allí.',
          goldenRule: '<strong>Dato clave:</strong> Casas con buen "home staging" se venden en promedio <strong>17% más rápido y a mejores precios.</strong>',
          checklist: [],
          guideTips: [
            {
              header: 'Antes de cada visita',
              headerIcon: 'calendar-check',
              items: [
                { label: 'Confirmar la cita 2 horas antes' },
                { label: 'Ventilar el espacio 30 minutos antes' },
                { label: 'Preparar una hoja de información o ficha del inmueble para entregar al interesado' },
              ],
            },
            {
              header: 'Durante la visita',
              headerIcon: 'calendar-check',
              items: [
                { label: 'Recibir cordialmente y dejar que explore a su ritmo' },
                { label: 'Resaltar las características únicas (vista, distribución, etc)' },
                { label: 'No hablar de precio hasta que lo pregunte' },
              ],
            },
            {
              header: 'Después de la visita',
              headerIcon: 'calendar-check',
              items: [
                { label: 'Hacer seguimiento a las 24-48 horas' },
                { label: 'Pedir retroalimentación honesta' },
                { label: 'Registrar objeciones comunes para corregirlas' },
              ],
            },
          ],
        },
      },
      {
        number: '2.3',
        title: 'Negocia como un pro',
        description: 'Cómo responder ofertas sin perder ni dejar ir al comprador',
        expanded: {
          tipIcon: 'dollar-purple',
          tipTitle: 'La negociación es un juego de información y tiempo.',
          tipBody: 'Quien más necesita cerrar el negocio tiene menos poder de negociación.',
          goldenRule: '<strong>Pro tip:</strong> Nunca aceptes la primera oferta de inmediato. Siempre contraoferta, aunque sea mínimamente. Da señal de que tu precio tiene sustento.',
          checklist: [],
          scenarioCards: {
            header: 'Escenarios de negociación',
            cards: [
              {
                icon: 'arrow-down',
                title: 'Te ofrecen mucho menos del precio',
                body: 'Contraoferta con un precio entre tu mínimo y tu precio de lista. Pide justificación de la oferta baja.',
              },
              {
                icon: 'arrow-right-left',
                title: 'Piden descuento a cambio de algo',
                body: '<strong>Evalúa el total:</strong> si piden 5% menos pero pagan de contado y cierran rápido, puede valer más que esperar al precio completo con financiación.',
              },
              {
                icon: 'dollar-check',
                title: 'Oferta razonable',
                body: 'Puedes aceptar o dar una contraoferta pequeña para cubrir gastos notariales. Define condiciones: fecha de firma, forma de pago, qué incluye.',
              },
            ],
          },
        },
      },
      {
        number: '2.4',
        title: 'La carta de intención y la promesa',
        description: 'Cómo formalizar el acuerdo antes de la escritura',
        expanded: {
          tipIcon: 'doc-edit',
          tipTitle: 'La promesa de compraventa es el "seguro" de la venta.',
          tipBody: 'Cuando hay un acuerdo verbal, necesitas convertirlo en papel lo más rápido posible.',
          goldenRule: '<strong>Dato clave:</strong> Una promesa bien redactada protege a ambas partes. Si el comprador se retracta, las arras son tuyas. Si tú te retractas, debes devolver el doble.',
          checklist: [],
          guideTips: {
            header: 'Qué debe incluir la promesa',
            headerIcon: 'calendar-check',
            items: [
              { label: 'Identificación completa de comprador y vendedor' },
              { label: 'Descripción exacta del inmueble', hint: '(matrícula inmobiliaria, dirección, linderos)' },
              { label: 'Precio acordado y forma de pago detallados', hint: '(contado, crédito, leasing)' },
              { label: 'Plazo para firma de escritura y entrega del inmueble' },
              { label: 'Valor de las arras y su naturaleza', hint: '(confirmatorias o de retracto)' },
              { label: 'Causas firmes para la rescisión o terminación' },
            ],
          },
          nextStageCta: {
            label: 'Continuar a Documentos y Pago',
            stageId: 'documentos',
          },
        },
      },
    ],
  },
  documentos: {
    etapa: 'Etapa 3 de 4',
    title: 'Documentos y pago',
    quote: 'La parte legal no tiene que ser complicada.',
    quoteDesc: 'Con los documentos correctos y un proceso claro, el cierre será mucho más ágil y seguro.',
    steps: [
      { number: '3.1', title: 'Reúne los documentos necesarios', description: 'La lista completa de papeles que necesitas tener listos.' },
      { number: '3.2', title: 'Verifica la situación legal', description: 'Asegúrate de que todo esté en orden antes de firmar.' },
      { number: '3.3', title: 'Define la forma de pago', description: 'Opciones claras para que ambas partes estén tranquilas.' },
    ],
  },
  entrega: {
    etapa: 'Etapa 4 de 4',
    title: 'Entrega',
    quote: 'El cierre perfecto. Todo listo para entregar las llaves.',
    quoteDesc: 'El último paso es tan importante como el primero. Una entrega bien hecha cierra el ciclo con tranquilidad.',
    steps: [
      { number: '4.1', title: 'Firma la escritura', description: 'El paso legal definitivo. Te explicamos qué esperar.' },
      { number: '4.2', title: 'Entrega del inmueble', description: 'Protocolo de entrega para que todo quede claro.' },
      { number: '4.3', title: 'Recibe tu dinero', description: 'Plazos y formas de recibir el pago de tu venta.' },
    ],
  },
}

const DollarCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8.5" stroke="#7955f9" strokeWidth="1.5"/>
    <path d="M10 5.5V6.5M10 13.5V14.5" stroke="#7955f9" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7.5 12c0 .828.895 1.5 2 1.5h1c1.105 0 2-.672 2-1.5s-.895-1.5-2-1.5h-1c-1.105 0-2-.672-2-1.5s.895-1.5 2-1.5h1c1.105 0 2 .672 2 1.5" stroke="#7955f9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

/* Icons exported from Figma (section 1.2) */
const ICON_MEMO_LIST = '/assets/3bc0cc62430788cadc7ac25f4264cc12644238ad.svg'
const ICON_PHOTO_TIP_DO = '/assets/6a6f1798ac463a687c468a0daefac090874afbf3.svg'
const ICON_PHOTO_TIP_DONT = '/assets/eb3ec379879581f176d25239536501559036a554.svg'
const ICON_EXPAND_ARROW = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

/* Icons exported from Figma (section 1.5) */
const ICON_PHONE_RINGING = '/assets/6cc58b54d24e765132af5fea21e4b04c94f6e4ce.svg'
const ICON_PHONE_BUBBLE = '/assets/3c7581a5284a6cd846537415823f848476d2e57b.svg'

/* Icons exported from Figma (section 2.x) */
const ICON_STAR_SHINE = '/assets/e506fa95ddb44cd33b2339b080c22cbc221088a1.svg'
const ICON_HEARTS = '/assets/63fc24ab4184667864c93c400a0524577057cb01.svg'

/* Icons exported from Figma (nav buttons) */

/* Icons exported from Figma (section 2.4) */
const ICON_DOC_EDIT = '/assets/icon-doc-edit.svg'

/* Icons exported from Figma (section 2.3) */
const ICON_DOLLAR_CHECK_PURPLE = '/assets/1cb947015ebdd5a72e8d341f8b1aaed3482380fa.svg'
const ICON_DOLLAR_USER = '/assets/aceaff2a9094e159545d5e4da5a6fa2c3d6f1094.svg'

const MemoIcon = () => (
  <img src={ICON_MEMO_LIST} alt="" width={20} height={20} className="vsa-guide__icon-memo" />
)

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <img src={ICON_PHONE_RINGING} alt="" width={24} height={24} className="vsa-guide__icon-phone-ringing" />
)

const StarIcon = () => (
  <img src={ICON_STAR_SHINE} alt="" width={24} height={22} className="vsa-guide__icon-star-shine" />
)

const HeartsIcon = () => (
  <img src={ICON_HEARTS} alt="" width={22} height={22} className="vsa-guide__icon-hearts" />
)

const DocEditIcon = () => (
  <img src={ICON_DOC_EDIT} alt="" width={20} height={20} className="vsa-guide__icon-doc-edit" />
)

const DollarCheckPurpleIcon = () => (
  <img src={ICON_DOLLAR_CHECK_PURPLE} alt="" width={32} height={32} className="vsa-guide__icon-dollar-purple" />
)

const DollarUserIcon = () => (
  <img src={ICON_DOLLAR_USER} alt="" width={24} height={24} className="vsa-guide__icon-dollar-user" />
)

const ICON_ARROW_DOWN = '/assets/d39e91a59a32b5b5740251fda7ef2c4a50c662dd.svg'
const ICON_ARROW_RIGHT_LEFT = '/assets/arrow-right-left.svg'
const ICON_DOLLAR_CHECK_GREEN = '/assets/45f3a8cc12a16d43668ab18973632e1af631914b.svg'

const PhoneBubbleIcon = () => (
  <img src={ICON_PHONE_BUBBLE} alt="" width={24} height={24} className="vsa-guide__icon-phone-bubble" />
)

const GreenCheckBullet = () => (
  <img src={ICON_PHOTO_TIP_DO} alt="" width={14} height={14} className="vsa-guide__icon-photo-do" />
)

const RedXBullet = () => (
  <img src={ICON_PHOTO_TIP_DONT} alt="" width={14} height={14} className="vsa-guide__icon-photo-dont" />
)

const ArrowUpRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="#9747ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


function ExpandedPanel({
  content,
  stepNumber,
  onClose,
  onCheckChange,
  onNavigateTab,
  onNavigateStep,
  onOpenFicha,
  hasPrev,
  hasNext,
}: {
  content: StepExpandedContent
  stepNumber: string
  onClose: () => void
  onCheckChange: () => void
  onNavigateTab?: (tabId: string) => void
  onNavigateStep?: (direction: 'prev' | 'next') => void
  onOpenFicha?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}) {
  const [checks, setChecks] = useState(() =>
    getChecklist(stepNumber, content.checklist.length)
  )

  function toggleCheck(index: number) {
    const next = [...checks]
    next[index] = !next[index]
    setChecks(next)
    saveChecklist(stepNumber, next)
    onCheckChange()
  }

  const doneCount = checks.filter(Boolean).length

  const doItems = content.photoTips?.items.filter(i => i.type === 'do') ?? []
  const dontItems = content.photoTips?.items.filter(i => i.type === 'dont') ?? []

  return (
    <div className="vsa-guide__expanded">
      <div className="vsa-guide__expanded-header">
        <button type="button" className="vsa-guide__expanded-close" onClick={onClose} aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="vsa-guide__expanded-body">
        <div className="vsa-guide__expanded-tip">
          <div className="vsa-guide__expanded-tip-top">
            <div className="vsa-guide__expanded-tip-icon">
              {content.tipIcon === 'memo' && <MemoIcon />}
              {content.tipIcon === 'users' && <UsersIcon />}
              {content.tipIcon === 'phone' && <PhoneIcon />}
              {content.tipIcon === 'star' && <StarIcon />}
              {content.tipIcon === 'hearts' && <HeartsIcon />}
              {content.tipIcon === 'dollar-purple' && <DollarCheckPurpleIcon />}
              {content.tipIcon === 'doc-edit' && <DocEditIcon />}
              {(!content.tipIcon || content.tipIcon === 'dollar') && <DollarCheckIcon />}
            </div>
            <h5 className="vsa-guide__expanded-tip-title">{content.tipTitle}</h5>
            <p className="vsa-guide__expanded-tip-body">{content.tipBody}</p>
          </div>
          {content.goldenRule && <p className="vsa-guide__expanded-tip-rule" dangerouslySetInnerHTML={{ __html: content.goldenRule }} />}
          {content.cta && (
            <a href={content.cta.href} className="vsa-guide__inline-cta">
              <span className="vsa-guide__inline-cta-label">{content.cta.label}</span>
              <span className="vsa-guide__inline-cta-icon">
                <img src={ICON_EXPAND_ARROW} alt="" width={24} height={24} />
              </span>
            </a>
          )}
        </div>

        {content.scenarioCards ? (
          <div className="vsa-guide__scenario-section">
            <div className="vsa-guide__scenario-header">
              <DollarUserIcon />
              <span className="vsa-guide__scenario-header-text">{content.scenarioCards.header}</span>
            </div>
            <div className="vsa-guide__scenario-cards">
              {content.scenarioCards.cards.map((card, i) => (
                <div key={i} className="vsa-guide__scenario-card">
                  <div className="vsa-guide__scenario-card-top">
                    <img
                      src={card.icon === 'arrow-down' ? ICON_ARROW_DOWN : card.icon === 'arrow-right-left' ? ICON_ARROW_RIGHT_LEFT : ICON_DOLLAR_CHECK_GREEN}
                      alt=""
                      width={24}
                      height={24}
                      className="vsa-guide__scenario-card-icon"
                    />
                    <span className="vsa-guide__scenario-card-title">{card.title}</span>
                  </div>
                  <p className="vsa-guide__scenario-card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
                </div>
              ))}
            </div>
          </div>
        ) : content.guideTips ? (
          <div className="vsa-guide__expanded-guide-tips">
            {(Array.isArray(content.guideTips) ? content.guideTips : [content.guideTips]).map((group, gi) => (
              <div key={gi} className="vsa-guide__guide-group">
                <div className="vsa-guide__guide-group-header">
                  {group.headerIcon === 'phone-bubble'
                    ? <PhoneBubbleIcon />
                    : <img src="/assets/calendar-check-circle.svg" alt="" width={20} height={20} className="vsa-guide__icon-calendar" />}
                  <span className="vsa-guide__guide-group-header-text">{group.header}</span>
                </div>
                <div className="vsa-guide__expanded-checklist">
                  {group.items.map((item, i) => (
                    <div key={i} className="vsa-guide__guide-tip-item">
                      <span className="vsa-guide__guide-tip-bullet" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#21C45D"/><path d="M5.5 9L8 11.5L13 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="vsa-guide__guide-tip-text">
                        <span className="vsa-guide__guide-tip-label">{item.label}</span>
                        {item.hint && <span className="vsa-guide__guide-tip-hint">{item.hint}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vsa-guide__expanded-checklist">
            {content.checklist.map((item, i) => (
              <label key={i} className={`vsa-guide__check-item${checks[i] ? ' vsa-guide__check-item--done' : ''}`}>
                <span className="vsa-guide__check-box">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => toggleCheck(i)}
                  />
                  <span className="vsa-guide__check-mark">
                    {checks[i] && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#7f56d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </span>
                </span>
                <span className="vsa-guide__check-text">
                  <span className={`vsa-guide__check-label${checks[i] ? ' vsa-guide__check-label--done' : ''}`}>{item.label}</span>
                  {item.hint && <span className="vsa-guide__check-hint">{item.hint}</span>}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {content.photoTips && (
        <div className="vsa-guide__photo-tips">
          <h5 className="vsa-guide__photo-tips-title">{content.photoTips.title}</h5>
          <div className="vsa-guide__photo-tips-grid">
            <div className="vsa-guide__photo-tips-col">
              {doItems.map((item, i) => (
                <div key={i} className="vsa-guide__photo-tip-item vsa-guide__photo-tip-item--do">
                  <GreenCheckBullet />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="vsa-guide__photo-tips-col">
              {dontItems.map((item, i) => (
                <div key={i} className="vsa-guide__photo-tip-item vsa-guide__photo-tip-item--dont">
                  <RedXBullet />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {content.portalCards && content.portalCards.length > 0 && (
        <div className="vsa-guide__portal-cards">
          {content.portalCards.map((card, i) => (
            <div key={i} className={`vsa-guide__portal-card${card.recommended ? ' vsa-guide__portal-card--recommended' : ''}`}>
              <div className="vsa-guide__portal-card-header">
                {card.recommended ? 'Recomendado' : card.headerText}
              </div>
              <div className="vsa-guide__portal-card-body">
                <h5 className="vsa-guide__portal-card-title">{card.title}</h5>
                <p className="vsa-guide__portal-card-desc">
                  {card.desc}
                  {' '}
                  <a href={card.linkHref} target="_blank" rel="noopener noreferrer" className="vsa-guide__expanded-tip-link">{card.linkText}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.darkCta && (
        <div className="vsa-guide__dark-cta">
          <div className="vsa-guide__dark-cta-text">
            <h5 className="vsa-guide__dark-cta-title">{content.darkCta.title}</h5>
            <p className="vsa-guide__dark-cta-desc">{content.darkCta.desc}</p>
          </div>
          <button type="button" className="vsa-guide__dark-cta-btn" onClick={() => onOpenFicha?.()}>
            <span className="vsa-guide__dark-cta-btn-label">{content.darkCta.label}</span>
            <span className="vsa-guide__dark-cta-btn-icon">
              <img src={ICON_EXPAND_ARROW} alt="" width={24} height={24} className="vsa-guide__icon-expand-arrow" />
            </span>
          </button>
        </div>
      )}

      {content.externalLinks && (
        <div className="vsa-guide__expanded-tool">
          <div className="vsa-guide__expanded-tool-right">
            <p className="vsa-guide__expanded-tool-also">También puedes consultar:</p>
            <div className="vsa-guide__expanded-links">
              {content.externalLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="vsa-guide__expanded-link">
                  {link.label}
                  <ArrowUpRightIcon />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {content.checklist.length > 0 && (
        <p className="vsa-guide__expanded-counter">{doneCount} de {content.checklist.length} tareas completadas</p>
      )}

      {content.nextStageCta && (
        <div className="vsa-guide__next-stage-cta">
          <button
            type="button"
            className="vsa-guide__next-stage-btn"
            onClick={() => onNavigateTab?.(content.nextStageCta!.stageId)}
          >
            <span>{content.nextStageCta.label}</span>
            <ArrowRightIcon />
          </button>
        </div>
      )}

      {(hasPrev || hasNext) && (
        <div className="vsa-guide__step-nav">
          {hasPrev ? (
            <button
              type="button"
              className="vsa-guide__step-nav-prev"
              onClick={() => onNavigateStep?.('prev')}
            >
              Anterior
            </button>
          ) : <span />}
          {hasNext && (
            <button
              type="button"
              className="vsa-guide__step-nav-next"
              onClick={() => onNavigateStep?.('next')}
            >
              <span>Siguiente</span>
              <ArrowRightIcon />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function VsaGuide() {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('vsa-user-stage')
    const stage = saved ? parseInt(saved, 10) : 1
    return STAGE_TO_TAB[stage] || 'precio'
  })
  const [expandedStep, setExpandedStep] = useState<string | null>(() => {
    const saved = localStorage.getItem('vsa-user-stage')
    const stage = saved ? parseInt(saved, 10) : 1
    const tabId = STAGE_TO_TAB[stage] || 'precio'
    return STEPS_BY_TAB[tabId]?.steps[0]?.number ?? null
  })
  const [checkVersion, setCheckVersion] = useState(0)
  const [fichaOpen, setFichaOpen] = useState(false)
  const introRef = useReveal<HTMLDivElement>()
  const contentRef = useReveal<HTMLDivElement>()
  const tabsWrapRef = useRef<HTMLDivElement>(null)

  const scrollToContent = useCallback(() => {
    requestAnimationFrame(() => {
      const tabsEl = tabsWrapRef.current
      if (!tabsEl) return
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 78
      const targetY = tabsEl.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    })
  }, [])

  const handleStageChange = useCallback((e: Event) => {
    const stage = (e as CustomEvent).detail?.stage as number
    const tabId = STAGE_TO_TAB[stage]
    if (tabId) {
      setActiveTab(tabId)
      setExpandedStep(STEPS_BY_TAB[tabId]?.steps[0]?.number ?? null)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('vsa-stage-change', handleStageChange)
    return () => window.removeEventListener('vsa-stage-change', handleStageChange)
  }, [handleStageChange])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href="#crear-ficha"]')
      if (anchor) {
        e.preventDefault()
        setFichaOpen(true)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const tabData = STEPS_BY_TAB[activeTab]

  function handleStepClick(step: StepItem) {
    if (!step.expanded) return
    setExpandedStep(expandedStep === step.number ? null : step.number)
  }

  return (
    <section className="vsa-guide" id="guia-etapas">
      <div className="vsa-guide__container">
        <div ref={introRef} className="vsa-guide__intro reveal">
          <div className="vsa-guide__intro-icon">
            <img src="/figma-assets-new/b672a8b086e223d883ae2a26c4c6566ed8684610.svg" alt="" width={34} height={38} />
          </div>
          <p className="vsa-guide__intro-pill">
            Vender por tu cuenta no significa que estés solo.
          </p>
          <h2 className="vsa-guide__intro-title">
            Guía para <em>mejorar tus ventas</em><br />en cada etapa.
          </h2>
          <p className="vsa-guide__intro-desc">
            Esta guía te ayuda a completar las tareas más importantes que debes realizar en cada etapa si quieres vender por tu cuenta.
          </p>
        </div>

        <div ref={tabsWrapRef} className="vsa-guide__tabs-wrap">
          <nav className="vsa-guide__tabs" aria-label="Etapas de venta">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`vsa-guide__tab${activeTab === tab.id ? ' vsa-guide__tab--active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setExpandedStep(STEPS_BY_TAB[tab.id]?.steps[0]?.number ?? null); scrollToContent() }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div ref={contentRef} className="vsa-guide__content reveal" key={activeTab}>
          <div className="vsa-guide__stage-header">
            <span className="vsa-guide__stage-label">{tabData.etapa}</span>
            <h3 className="vsa-guide__stage-title">{tabData.title}</h3>
          </div>

          <div className="vsa-guide__quote-block">
            <div className="vsa-guide__quote-left">
              <p className="vsa-guide__quote-text">{tabData.quote}</p>
            </div>
            <div className="vsa-guide__quote-right">
              <p className="vsa-guide__quote-desc" dangerouslySetInnerHTML={{ __html: tabData.quoteDesc }} />
            </div>
          </div>

          <div className="vsa-guide__steps">
            {tabData.steps.map((step) => {
              const isExpanded = expandedStep === step.number
              const isDimmed = expandedStep !== null && !isExpanded
              const hasContent = !!step.expanded

              void checkVersion
              const stepChecklistLen = step.expanded?.checklist.length ?? 0
              const gt = step.expanded?.guideTips
              const stepGuideTipsLen = gt
                ? (Array.isArray(gt) ? gt.reduce((sum, g) => sum + g.items.length, 0) : gt.items.length)
                : 0
              const stepScenarioLen = step.expanded?.scenarioCards?.cards.length ?? 0
              const checks = stepChecklistLen > 0
                ? getChecklist(step.number, stepChecklistLen)
                : []
              const doneCount = checks.filter(Boolean).length
              const totalCount = stepChecklistLen > 0 ? stepChecklistLen : stepGuideTipsLen

              return (
                <div key={step.number} className="vsa-guide__step-wrapper">
                  <div
                    className={`vsa-guide__step${isDimmed ? ' vsa-guide__step--dimmed' : ''}${isExpanded ? ' vsa-guide__step--expanded' : ''}${hasContent ? ' vsa-guide__step--clickable' : ''}`}
                    onClick={() => handleStepClick(step)}
                  >
                    <span className="vsa-guide__step-number">{step.number}</span>
                    <h4 className="vsa-guide__step-title">{step.title}</h4>
                    <div className="vsa-guide__step-meta">
                      <p className="vsa-guide__step-desc">{step.description}</p>
                      {hasContent && stepChecklistLen > 0 && (
                        <p className="vsa-guide__step-tasks">{doneCount} de {totalCount} tareas completadas</p>
                      )}
                      {hasContent && stepChecklistLen === 0 && stepGuideTipsLen > 0 && (
                        <p className="vsa-guide__step-tasks">{stepGuideTipsLen} tips para atender mejor</p>
                      )}
                      {hasContent && stepChecklistLen === 0 && stepGuideTipsLen === 0 && stepScenarioLen > 0 && (
                        <p className="vsa-guide__step-tasks">{stepScenarioLen} escenarios de negociación</p>
                      )}
                    </div>
                    <span className={`vsa-guide__step-arrow${isExpanded ? ' vsa-guide__step-arrow--open' : ''}`} aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>

                  {isExpanded && step.expanded && (() => {
                    const stepIndex = tabData.steps.indexOf(step)
                    const hasPrev = stepIndex > 0
                    const hasNext = stepIndex < tabData.steps.length - 1
                    return (
                      <ExpandedPanel
                        content={step.expanded}
                        stepNumber={step.number}
                        onClose={() => setExpandedStep(null)}
                        onCheckChange={() => setCheckVersion(v => v + 1)}
                        onNavigateTab={(tabId) => { setActiveTab(tabId); setExpandedStep(null); scrollToContent() }}
                        onOpenFicha={() => setFichaOpen(true)}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onNavigateStep={(dir) => {
                          const target = dir === 'prev' ? tabData.steps[stepIndex - 1] : tabData.steps[stepIndex + 1]
                          if (target) setExpandedStep(target.number)
                        }}
                      />
                    )
                  })()}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {fichaOpen && <FichaCreator open={fichaOpen} onClose={() => setFichaOpen(false)} />}
      </Suspense>
    </section>
  )
}
