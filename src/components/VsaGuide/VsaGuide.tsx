import { useState, useEffect, useCallback, useId, lazy, Suspense } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { saveChecklistProgress, saveSaleStage } from '../../lib/storage-sync'
import './VsaGuide.css'

const FichaCreator = lazy(() => import('../FichaCreator/FichaCreator'))

const STAGE_TO_TAB: Record<number, string> = { 1: 'precio', 2: 'visitas', 3: 'documentos', 4: 'entrega' }
const TAB_TO_STAGE: Record<string, number> = { precio: 1, visitas: 2, documentos: 3, entrega: 4 }

const STAGE_OPTIONS = [
  {
    id: 1,
    short: 'Precio',
    name: 'Precio y difusión',
    label: 'Estoy definiendo un precio y promocionando la casa',
  },
  {
    id: 2,
    short: 'Visitas',
    name: 'Visitas y negociación',
    label: 'Estoy recibiendo visitas y negociando',
  },
  {
    id: 3,
    short: 'Documentos',
    name: 'Documentos y pago',
    label: 'Estoy alistando documentos para el pago',
  },
  {
    id: 4,
    short: 'Entrega',
    name: 'Entrega',
    label: 'Estoy alistando el inmueble para entrega',
  },
] as const

function readStageFromStorage(storageKey: string): number {
  const saved = localStorage.getItem(storageKey)
  if (saved === null) return 0
  const n = parseInt(saved, 10)
  return n >= 1 && n <= 4 ? n : 0
}

function scrollToContentPanel() {
  requestAnimationFrame(() => {
    const el = document.getElementById('vsa-sale-guide-content')
    if (!el) return
    const navHeight =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) ||
      78
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
    window.scrollTo({ top, behavior: 'smooth' })
  })
}

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
  icon: 'arrow-down' | 'arrow-right-left' | 'dollar'
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

type StepCardMeta =
  | { kind: 'checklist'; done: number; total: number; subtitle: string }
  | { kind: 'tips'; count: number; subtitle: string }
  | { kind: 'scenarios'; count: number; subtitle: string }
  | { kind: 'guide'; subtitle: string }
  | { kind: 'placeholder'; subtitle: string }

function getStepCardMeta(step: StepItem, _checkVersion: number): StepCardMeta {
  const exp = step.expanded
  if (!exp) {
    return { kind: 'placeholder', subtitle: 'Próximamente' }
  }

  const checklistLen = exp.checklist.length
  if (checklistLen > 0) {
    const checks = getChecklist(step.number, checklistLen)
    const done = checks.filter(Boolean).length
    return {
      kind: 'checklist',
      done,
      total: checklistLen,
      subtitle: `${done} de ${checklistLen} tareas`,
    }
  }

  const gt = exp.guideTips
  const tipsLen = gt
    ? Array.isArray(gt)
      ? gt.reduce((sum, g) => sum + g.items.length, 0)
      : gt.items.length
    : 0
  if (tipsLen > 0) {
    return { kind: 'tips', count: tipsLen, subtitle: `${tipsLen} tips` }
  }

  const scenarioLen = exp.scenarioCards?.cards.length ?? 0
  if (scenarioLen > 0) {
    return { kind: 'scenarios', count: scenarioLen, subtitle: `${scenarioLen} escenarios` }
  }

  return { kind: 'guide', subtitle: 'Tips' }
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
                icon: 'dollar',
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
    title: 'Documentos y Pago',
    quote: 'La parte burocrática. Suena aburrida pero es donde el dinero se vuelve real.',
    quoteDesc:
      'Esta etapa puede demorar entre <strong>2 y 8 semanas</strong>. Lo que la acelera o la frena son los documentos. Empieza a recogerlos desde antes de tener comprador.',
    steps: [
      {
        number: '3.1',
        title: 'Documentos del vendedor',
        description: 'Todo lo que necesitas tener listo antes de escriturar',
        expanded: {
          tipIcon: 'doc-edit',
          tipTitle: 'Documentos del vendedor',
          tipBody: 'Reúne estos papeles con anticipación. Si falta alguno, la notaría puede frenar todo el cierre.',
          goldenRule: '',
          checklist: [],
          guideTips: [
            {
              header: 'Documentos del vendedor',
              headerIcon: 'calendar-check',
              items: [
                { label: 'Cédula de ciudadanía vigente', hint: '(o poder notarial si alguien actúa en tu nombre)' },
                { label: 'Cédula del cónyuge y autorización o firma conjunta', hint: '(Solo si está casado)' },
                { label: 'Certificado de estado civil actualizado' },
              ],
            },
            {
              header: 'Documentos del inmueble',
              headerIcon: 'calendar-check',
              items: [
                { label: 'Certificado de tradición y libertad', hint: '(expedido máximo 30 días antes)' },
                { label: 'Escritura pública anterior de compra' },
                { label: 'Paz y salvo de impuesto predial del año en curso' },
                { label: 'Paz y salvo de valorización', hint: '(Si aplica)' },
                { label: 'Paz y salvo de administración actualizado', hint: '(Último pago)' },
                { label: 'Recibos de servicios públicos al día' },
                { label: 'Plano del inmueble', hint: '(Si lo tienes)' },
                { label: 'Reglamento de propiedad horizontal', hint: '(Si es apartamento)' },
              ],
            },
          ],
        },
      },
      {
        number: '3.2',
        title: 'Entiende los costos y retenciones',
        description: 'Cuánto te entra realmente en el bolsillo',
        expanded: {
          tipIcon: 'dollar-purple',
          tipTitle: 'Muchos vendedores se sorprenden en la notaría.',
          tipBody: 'La venta tiene costos que se descuentan del valor. Conócelos antes.',
          goldenRule:
            '<strong>Tip importante:</strong> Si la casa fue tu vivienda principal por más de 2 años, puedes estar exento del impuesto de ganancia ocasional bajo ciertas condiciones. Consúltalo con un contador.',
          checklist: [],
          scenarioCards: {
            header: 'Costos típicos en una venta',
            cards: [
              {
                icon: 'dollar',
                title: 'Gastos notariales',
                body: '~0.5% del valor (50/50 con el comprador). <strong>Vendedor</strong>',
              },
              {
                icon: 'dollar',
                title: 'Retención en la fuente',
                body: '1% del valor de venta (si supera tope anual). <strong>Vendedor</strong>',
              },
              {
                icon: 'dollar',
                title: 'Impuesto de ganancia ocasional',
                body: '10% sobre la ganancia (precio venta menos el precio de compra). <strong>Vendedor</strong>',
              },
              {
                icon: 'dollar',
                title: 'Registro de escritura',
                body: '0.5% del valor (comprador generalmente asume). <strong>Comprador</strong>',
              },
              {
                icon: 'dollar',
                title: 'Comisión inmobiliaria',
                body: '2% a 3% del valor de venta si usas inmobiliaria. <strong>Vendedor</strong>',
              },
            ],
          },
        },
      },
      {
        number: '3.3',
        title: 'La escrituración en notaría',
        description: 'El momento oficial del traspaso',
        expanded: {
          tipIcon: 'doc-edit',
          tipTitle: 'La escrituración es el acto legal donde la propiedad pasa oficialmente de tus manos a las del comprador.',
          tipBody: '¡No puede hacerse de forma privada!',
          goldenRule:
            '<strong>Tip importante:</strong> Si la casa fue tu vivienda principal por más de 2 años, puedes estar exento del impuesto de ganancia ocasional bajo ciertas condiciones. Consúltalo con un contador.',
          checklist: [],
          guideTips: {
            header: 'Pasos de la escrituración',
            headerIcon: 'calendar-check',
            items: [
              {
                label: 'Elegir la notaría',
                hint: 'Puede ser cualquier notaría en Colombia. El comprador generalmente elige, pero es negociable. Compara precios.',
              },
              {
                label: 'Presentar documentos',
                hint: 'La notaría verifica que todo esté en orden antes de la firma. Pueden pedir documentos adicionales.',
              },
              {
                label: 'Día de la firma',
                hint: 'Ambas partes firman la escritura. En este momento (o antes) se hace el pago. Si hay crédito hipotecario, el banco desembolsa directamente.',
              },
              {
                label: 'Registro en la ORIP',
                hint: 'La notaría o el comprador lleva la escritura a la Oficina de Registro para que quede oficialmente a nombre del comprador. Puede demorar 5-15 días.',
              },
            ],
          },
        },
      },
      {
        number: '3.4',
        title: 'El pago: cómo y cuándo',
        description: 'Que el dinero llegue seguro y a tiempo',
        expanded: {
          tipIcon: 'dollar-purple',
          tipTitle: 'Formas de pago.',
          tipBody: 'Te explicamos cada una para que te sientas seguro con cada una.',
          goldenRule:
            '<strong>Importante:</strong> Nunca entregues las llaves sin haber recibido el pago completo o tener garantía bancaria confirmada. Una vez entregadas las llaves, tu poder de negociación es mínimo.',
          checklist: [],
          scenarioCards: {
            header: 'Formas de pago',
            cards: [
              {
                icon: 'dollar',
                title: 'Crédito hipotecario',
                body: 'El banco del comprador desembolsa directamente en la notaría o a tu cuenta. Es la forma más común y segura. <strong>Tiempo extra:</strong> 2-4 semanas para aprobación',
              },
              {
                icon: 'dollar',
                title: 'Efectivo / Transferencia',
                body: 'El comprador tiene el dinero disponible. Es el más rápido. Asegúrate de recibir antes de firmar o simultáneamente. <strong>Lo más rápido posible</strong>',
              },
              {
                icon: 'dollar',
                title: 'Subsidio VIS',
                body: 'Si tu casa califica, el comprador puede usar subsidio. El proceso tiene pasos adicionales con caja de compensación. <strong>Tiempo extra:</strong> 4-8 semanas',
              },
            ],
          },
          nextStageCta: {
            label: 'Continuar a Entrega',
            stageId: 'entrega',
          },
        },
      },
    ],
  },
  entrega: {
    etapa: 'Etapa 4 de 4',
    title: 'Entrega',
    quote: 'La recta final. El cierre oficial y el comienzo de lo que sigue.',
    quoteDesc:
      '¡Ya casi! Si llegaste aquí, lo más difícil ya pasó. Esta etapa es la de cerrar con broche de oro.',
    steps: [
      {
        number: '4.1',
        title: 'Acta de entrega',
        description: 'Formaliza la entrega para protegerte después',
        expanded: {
          tipIcon: 'doc-edit',
          tipTitle: 'El acta de entrega te protege de reclamaciones futuras.',
          tipBody:
            'El acta de entrega es el documento que deja constancia del estado del inmueble en el momento de la entrega.',
          goldenRule: '',
          checklist: [],
          guideTips: {
            header: 'Qué debe incluir el acta de entrega',
            headerIcon: 'calendar-check',
            items: [
              { label: 'Fecha y hora exacta de entrega' },
              { label: 'Estado de cada habitación', hint: '(paredes, pisos, ventanas, puertas)' },
              { label: 'Lecturas de contadores de agua, gas y luz' },
              { label: 'Lista de llaves entregadas', hint: '(principal, parqueadero, depósito, zonas comunes)' },
              { label: 'Estado de electrodomésticos que quedan', hint: '(si aplica)' },
              { label: 'Firmas de ambas partes con cédula' },
              { label: 'Fotos del estado del inmueble adjuntas' },
            ],
          },
        },
      },
      {
        number: '4.2',
        title: 'Traslado de servicios y obligaciones',
        description: 'Los últimos trámites para salir limpio',
        expanded: {
          tipIcon: 'star',
          tipTitle: 'Traslado de servicios',
          tipBody: 'Los últimos trámites para salir limpio y sin deudas pendientes a tu nombre.',
          goldenRule: '',
          checklist: [
            { label: 'Notificar a empresa de agua el cambio de titular', hint: '(aplica si hay créditos atados al servicio)' },
            { label: 'Notificar a empresa de gas el cambio de titular', hint: '(aplica si hay créditos atados al servicio)' },
            { label: 'Notificar a empresa de energía el cambio de titular', hint: '(aplica si hay créditos atados al servicio)' },
            { label: 'Cancelar o transferir internet y TV cable', hint: '(Solicitar paz y salvo si aplica)' },
            { label: 'Actualizar en la DIAN y CHIP el nuevo propietario (predial)' },
            { label: 'Cancelar seguros asociados al inmueble' },
          ],
        },
      },
      {
        number: '4.3',
        title: 'Declaración de renta y cierre fiscal',
        description: 'El paso que muchos olvidan y les genera líos después',
        expanded: {
          tipIcon: 'dollar-purple',
          tipTitle: 'La venta de un inmueble genera obligaciones tributarias.',
          tipBody: 'Debes reportarla en tu declaración de renta del año en que se firmó la escritura.',
          goldenRule:
            '<strong>Importante:</strong> Si reinviertes el dinero en la compra de otra vivienda en el mismo año fiscal, puedes acceder a beneficios tributarios. Consulta con un contador.',
          checklist: [],
          guideTips: {
            header: 'Tareas fiscales post-venta',
            headerIcon: 'calendar-check',
            items: [
              { label: 'Guardar copia de la escritura de compra original', hint: '(para calcular ganancia)' },
              { label: 'Calcular la ganancia ocasional:', hint: 'precio venta - precio compra ajustado' },
              { label: 'Consultar con contador si aplica exención por vivienda principal' },
              { label: 'Reportar en declaración de renta del año fiscal correspondiente' },
              { label: 'Si la retención ya fue pagada en notaría, solicitar el certificado' },
            ],
          },
        },
      },
      {
        number: '4.4',
        title: '¡Felicitaciones! ¿Y ahora qué?',
        description: 'El resumen y el próximo paso',
        expanded: {
          tipIcon: 'hearts',
          tipTitle: '¡Lo lograste!',
          tipBody:
            'Vendiste tu casa. Eso es un logro enorme. Ahora viene lo más importante: qué haces con ese capital.',
          goldenRule: '',
          checklist: [],
          portalCards: [
            {
              recommended: true,
              title: 'Comprar la siguiente casa',
              desc: 'En Habi también puedes encontrar tu próximo hogar con miles de opciones.',
              linkText: 'Explorar en Habi',
              linkHref: 'https://www.habi.co',
            },
            {
              title: 'Invertir en finca raíz',
              desc: 'El capital de una venta puede trabajar muy bien en el sector inmobiliario.',
              linkText: 'Conocer opciones',
              linkHref: 'https://www.habi.co',
            },
            {
              title: 'Hablar con un asesor',
              desc: 'Nuestro equipo puede orientarte en el siguiente paso según tu situación.',
              linkText: 'Agendar llamada',
              linkHref: 'https://www.habi.co',
            },
          ],
        },
      },
    ],
  },
}

/** Icono informativo $ (tips, cards de escenario) — sin check */
const InformativeDollarIcon = ({
  size = 20,
  className = '',
}: {
  size?: number
  className?: string
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <circle cx="10" cy="10" r="8.5" stroke="#7955f9" strokeWidth="1.5" />
    <path d="M10 5.5V6.5M10 13.5V14.5" stroke="#7955f9" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M7.5 12c0 .828.895 1.5 2 1.5h1c1.105 0 2-.672 2-1.5s-.895-1.5-2-1.5h-1c-1.105 0-2-.672-2-1.5s.895-1.5 2-1.5h1c1.105 0 2 .672 2 1.5"
      stroke="#7955f9"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

/* Icons exported from Figma (section 1.2) */
const ICON_MEMO_LIST = '/assets/3bc0cc62430788cadc7ac25f4264cc12644238ad.svg'
const ICON_PHOTO_TIP_DONT = '/assets/eb3ec379879581f176d25239536501559036a554.svg'
const ICON_EXPAND_ARROW = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

/* Icons exported from Figma (section 1.5) */
const ICON_PHONE_RINGING = '/assets/6cc58b54d24e765132af5fea21e4b04c94f6e4ce.svg'
/* Icons exported from Figma (section 2.x) */
const ICON_STAR_SHINE = '/assets/e506fa95ddb44cd33b2339b080c22cbc221088a1.svg'
const ICON_HEARTS = '/assets/63fc24ab4184667864c93c400a0524577057cb01.svg'

/* Icons exported from Figma (nav buttons) */

/* Icons exported from Figma (section 2.4) */
const ICON_DOC_EDIT = '/assets/icon-doc-edit.svg'

/* Icons exported from Figma (section 2.3) */
const ICON_DOLLAR_CHECK_PURPLE = '/assets/1cb947015ebdd5a72e8d341f8b1aaed3482380fa.svg'
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

const ICON_ARROW_DOWN = '/assets/d39e91a59a32b5b5740251fda7ef2c4a50c662dd.svg'
const ICON_ARROW_RIGHT_LEFT = '/assets/arrow-right-left.svg'
/** Checkbox cuadrado — solo lista de verificación interactiva */
const CheckboxVisual = ({ checked }: { checked: boolean }) => (
  <span
    className={`vsa-guide__checkbox${checked ? ' vsa-guide__checkbox--checked' : ''}`}
    aria-hidden="true"
  />
)

/** Icono informativo para listas de tips (no marcable) */
const InfoListIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    className="vsa-guide__info-list-icon"
  >
    <circle cx="9" cy="9" r="8" fill="#f5f3ff" stroke="#7955f9" strokeWidth="1.25" />
    <path d="M9 8v4M9 5.75v.5" stroke="#7955f9" strokeWidth="1.35" strokeLinecap="round" />
  </svg>
)

/** Icono informativo “sí hacer” en tips de fotos */
const PhotoTipDoIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className="vsa-guide__photo-tip-do-icon"
  >
    <circle cx="8" cy="8" r="7" fill="#ecfdf5" stroke="#21C45D" strokeWidth="1.25" />
    <path
      d="M5 8l2 2 4-4"
      stroke="#21C45D"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function ScenarioCardIcon({ icon }: { icon: ScenarioCard['icon'] }) {
  if (icon === 'arrow-down') {
    return (
      <img src={ICON_ARROW_DOWN} alt="" width={22} height={22} className="vsa-guide__scenario-card-icon" />
    )
  }
  if (icon === 'arrow-right-left') {
    return (
      <img
        src={ICON_ARROW_RIGHT_LEFT}
        alt=""
        width={22}
        height={22}
        className="vsa-guide__scenario-card-icon"
      />
    )
  }
  return (
    <InformativeDollarIcon size={22} className="vsa-guide__scenario-card-icon vsa-guide__icon-informative-dollar" />
  )
}

const RedXBullet = () => (
  <img src={ICON_PHOTO_TIP_DONT} alt="" width={14} height={14} className="vsa-guide__icon-photo-dont" />
)

const ArrowUpRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="#9747ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const STEP_CARD_ICON_DEFAULTS: Record<string, NonNullable<StepExpandedContent['tipIcon']>> = {
  '1.1': 'dollar',
  '3.1': 'doc-edit',
  '3.2': 'dollar-purple',
  '3.3': 'doc-edit',
  '3.4': 'dollar-purple',
  '4.1': 'doc-edit',
  '4.2': 'star',
  '4.3': 'dollar-purple',
  '4.4': 'hearts',
}

function getStepCardIcon(step: StepItem): NonNullable<StepExpandedContent['tipIcon']> {
  return step.expanded?.tipIcon ?? STEP_CARD_ICON_DEFAULTS[step.number] ?? 'memo'
}

function StepCardIcon({ icon }: { icon: NonNullable<StepExpandedContent['tipIcon']> }) {
  return (
    <span className="vsa-guide__card-icon" aria-hidden="true">
      {icon === 'memo' && <MemoIcon />}
      {icon === 'users' && <UsersIcon />}
      {icon === 'phone' && <PhoneIcon />}
      {icon === 'star' && <StarIcon />}
      {icon === 'hearts' && <HeartsIcon />}
      {icon === 'dollar-purple' && <DollarCheckPurpleIcon />}
      {icon === 'doc-edit' && <DocEditIcon />}
      {(!icon || icon === 'dollar') && <InformativeDollarIcon />}
    </span>
  )
}

function StepModalContent({
  content,
  stepNumber,
  onCheckChange,
  onNavigateStage,
  onNavigateStep,
  onOpenFicha,
  hasPrev,
  hasNext,
}: {
  content: StepExpandedContent
  stepNumber: string
  onCheckChange: () => void
  onNavigateStage?: (tabId: string) => void
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

  const hasRightColumn =
    !!content.scenarioCards || !!content.guideTips || content.checklist.length > 0

  const hasFooter =
    content.checklist.length > 0 ||
    !!content.nextStageCta ||
    hasPrev ||
    hasNext

  return (
    <>
      <div className="vsa-guide__modal-body">
        <div className="vsa-guide__modal-content vsa-guide__expanded-body">
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
              {(!content.tipIcon || content.tipIcon === 'dollar') && <InformativeDollarIcon />}
            </div>
            <h2 className="vsa-guide__expanded-tip-title">{content.tipTitle}</h2>
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

        {hasRightColumn && (content.scenarioCards ? (
          <section className="vsa-guide__modal-section vsa-guide__scenario-section">
            <h3 className="vsa-guide__modal-section-title">{content.scenarioCards.header}</h3>
            <div className="vsa-guide__modal-card-grid vsa-guide__scenario-cards">
              {content.scenarioCards.cards.map((card, i) => (
                <article key={i} className="vsa-guide__scenario-card">
                  <div className="vsa-guide__scenario-card-top">
                    <ScenarioCardIcon icon={card.icon} />
                    <h4 className="vsa-guide__scenario-card-title">{card.title}</h4>
                  </div>
                  <p className="vsa-guide__scenario-card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
                </article>
              ))}
            </div>
          </section>
        ) : content.guideTips ? (
          <section className="vsa-guide__modal-section vsa-guide__modal-section--stacked vsa-guide__expanded-guide-tips">
            {(Array.isArray(content.guideTips) ? content.guideTips : [content.guideTips]).map((group, gi) => (
              <div key={gi} className="vsa-guide__modal-subsection vsa-guide__guide-group">
                <h3 className="vsa-guide__modal-section-title">{group.header}</h3>
                <div className="vsa-guide__modal-list vsa-guide__expanded-checklist">
                  {group.items.map((item, i) => (
                    <div key={i} className="vsa-guide__guide-tip-item">
                      <span className="vsa-guide__guide-tip-bullet" aria-hidden="true">
                        <InfoListIcon />
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
          </section>
        ) : (
          <section className="vsa-guide__modal-section">
            <h3 className="vsa-guide__modal-section-title">Lista de verificación</h3>
            <div className="vsa-guide__modal-list vsa-guide__expanded-checklist">
            {content.checklist.map((item, i) => (
              <label key={i} className={`vsa-guide__check-item${checks[i] ? ' vsa-guide__check-item--done' : ''}`}>
                <span className="vsa-guide__check-box">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => toggleCheck(i)}
                  />
                  <CheckboxVisual checked={checks[i]} />
                </span>
                <span className="vsa-guide__check-text">
                  <span className={`vsa-guide__check-label${checks[i] ? ' vsa-guide__check-label--done' : ''}`}>{item.label}</span>
                  {item.hint && <span className="vsa-guide__check-hint">{item.hint}</span>}
                </span>
              </label>
            ))}
            </div>
          </section>
        ))}

        {content.photoTips && (
        <section className="vsa-guide__modal-section vsa-guide__photo-tips">
          <h3 className="vsa-guide__modal-section-title vsa-guide__photo-tips-title">{content.photoTips.title}</h3>
          <div className="vsa-guide__photo-tips-grid">
            <div className="vsa-guide__photo-tips-col">
              {doItems.map((item, i) => (
                <div key={i} className="vsa-guide__photo-tip-item vsa-guide__photo-tip-item--do">
                  <PhotoTipDoIcon />
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
        </section>
        )}

        {content.portalCards && content.portalCards.length > 0 && (
        <section className="vsa-guide__modal-section">
          <h3 className="vsa-guide__modal-section-title">¿Qué puedes hacer ahora?</h3>
          <div className="vsa-guide__modal-card-grid vsa-guide__portal-cards">
          {content.portalCards.map((card, i) => (
            <div
              key={i}
              className={`vsa-guide__portal-card${card.recommended ? ' vsa-guide__portal-card--recommended' : ''}${card.recommended || card.headerText ? '' : ' vsa-guide__portal-card--no-header'}`}
            >
              {(card.recommended || card.headerText) && (
                <div className="vsa-guide__portal-card-header">
                  {card.recommended ? 'Recomendado' : card.headerText}
                </div>
              )}
              <div className="vsa-guide__portal-card-body">
                <h4 className="vsa-guide__portal-card-title">{card.title}</h4>
                <p className="vsa-guide__portal-card-desc">
                  {card.desc}{' '}
                  <a href={card.linkHref} target="_blank" rel="noopener noreferrer" className="vsa-guide__expanded-tip-link">
                    {card.linkText}
                  </a>
                </p>
              </div>
            </div>
          ))}
          </div>
        </section>
        )}

        {content.darkCta && (
        <section className="vsa-guide__modal-section vsa-guide__dark-cta">
          <div className="vsa-guide__dark-cta-text">
            <h3 className="vsa-guide__modal-section-title vsa-guide__dark-cta-title">{content.darkCta.title}</h3>
            <p className="vsa-guide__dark-cta-desc">{content.darkCta.desc}</p>
          </div>
          <button type="button" className="vsa-guide__dark-cta-btn" onClick={() => onOpenFicha?.()}>
            <span className="vsa-guide__dark-cta-btn-label">{content.darkCta.label}</span>
            <span className="vsa-guide__dark-cta-btn-icon">
              <img src={ICON_EXPAND_ARROW} alt="" width={24} height={24} className="vsa-guide__icon-expand-arrow" />
            </span>
          </button>
        </section>
        )}

        {content.externalLinks && (
        <section className="vsa-guide__modal-section vsa-guide__expanded-tool">
          <div className="vsa-guide__expanded-tool-right">
            <h3 className="vsa-guide__modal-section-title vsa-guide__expanded-tool-also">También puedes consultar</h3>
            <div className="vsa-guide__expanded-links">
              {content.externalLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="vsa-guide__expanded-link">
                  {link.label}
                  <ArrowUpRightIcon />
                </a>
              ))}
            </div>
          </div>
        </section>
        )}
        </div>
      </div>

      {hasFooter && (
        <footer className="vsa-guide__modal-footer">
          {content.checklist.length > 0 && (
            <p className="vsa-guide__expanded-counter">
              {doneCount} de {content.checklist.length} tareas completadas
            </p>
          )}

          <div className="vsa-guide__modal-footer-actions">
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
                ) : (
                  <span />
                )}
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

            {content.nextStageCta && (
              <div className="vsa-guide__next-stage-cta">
                <button
                  type="button"
                  className="vsa-guide__next-stage-btn"
                  onClick={() => onNavigateStage?.(content.nextStageCta!.stageId)}
                >
                  <span>{content.nextStageCta.label}</span>
                  <ArrowRightIcon />
                </button>
              </div>
            )}
          </div>
        </footer>
      )}
    </>
  )
}

function StepCard({
  step,
  meta,
  onOpen,
}: {
  step: StepItem
  meta: StepCardMeta
  onOpen: () => void
}) {
  const progressPct =
    meta.kind === 'checklist' && meta.total > 0
      ? Math.round((meta.done / meta.total) * 100)
      : null
  const isComplete =
    meta.kind === 'checklist' && meta.total > 0 && meta.done === meta.total

  const cardIcon = getStepCardIcon(step)

  return (
    <button type="button" className={`vsa-guide__card${isComplete ? ' vsa-guide__card--complete' : ''}`} onClick={onOpen}>
      <div className="vsa-guide__card-top">
        <StepCardIcon icon={cardIcon} />
        <span className="vsa-guide__card-number">{step.number}</span>
      </div>
      <h4 className="vsa-guide__card-title">{step.title}</h4>
      <p className="vsa-guide__card-desc">{step.description}</p>
      {progressPct !== null ? (
        <div className="vsa-guide__card-progress">
          <div className="vsa-guide__card-progress-track">
            <div className="vsa-guide__card-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="vsa-guide__card-progress-label">{meta.subtitle}</span>
        </div>
      ) : (
        <span className="vsa-guide__card-badge">{meta.subtitle}</span>
      )}
      <span className="vsa-guide__card-cta">
        Ver tips
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

function StepModal({
  step,
  tabData,
  onClose,
  onCheckChange,
  onNavigateStage,
  onOpenFicha,
  onNavigateStep,
}: {
  step: StepItem
  tabData: (typeof STEPS_BY_TAB)[string]
  onClose: () => void
  onCheckChange: () => void
  onNavigateStage: (tabId: string) => void
  onOpenFicha: () => void
  onNavigateStep: (stepNumber: string) => void
}) {
  const stepIndex = tabData.steps.findIndex((s) => s.number === step.number)
  const hasPrev = stepIndex > 0
  const hasNext = stepIndex < tabData.steps.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="vsa-guide__modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vsa-step-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="vsa-guide__modal-panel">
        <header className="vsa-guide__modal-header">
          <div className="vsa-guide__modal-header-text">
            <span className="vsa-guide__modal-step-num">{step.number}</span>
            <h4 id="vsa-step-modal-title" className="vsa-guide__modal-step-title">
              {step.title}
            </h4>
          </div>
          <button type="button" className="vsa-guide__expanded-close" onClick={onClose} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {step.expanded ? (
          <StepModalContent
            key={step.number}
            content={step.expanded}
            stepNumber={step.number}
            onCheckChange={onCheckChange}
            onNavigateStage={onNavigateStage}
            onOpenFicha={onOpenFicha}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onNavigateStep={(dir) => {
              const target =
                dir === 'prev' ? tabData.steps[stepIndex - 1] : tabData.steps[stepIndex + 1]
              if (target) onNavigateStep(target.number)
            }}
          />
        ) : (
          <div className="vsa-guide__modal-body">
            <div className="vsa-guide__modal-placeholder">
              <p className="vsa-guide__modal-placeholder-desc">{step.description}</p>
              <p className="vsa-guide__modal-placeholder-note">
                Pronto tendrás aquí la guía detallada para este paso.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export interface VsaSaleGuideProps {
  storageKey?: string
  title?: string
  subtitle?: string
}

export function VsaSaleGuide({
  storageKey = 'vsa-user-stage',
  title = 'Tu guía de venta',
  subtitle = 'Elige el momento que mejor describe tu situación hoy. No hay un orden obligatorio: puedes cambiarlo cuando quieras.',
}: VsaSaleGuideProps) {
  const groupId = useId()
  const [activeStage, setActiveStage] = useState(() => readStageFromStorage(storageKey))
  const [modalStep, setModalStep] = useState<string | null>(null)
  const [checkVersion, setCheckVersion] = useState(0)
  const [fichaOpen, setFichaOpen] = useState(false)
  const headerRef = useReveal<HTMLDivElement>()
  const contentRef = useReveal<HTMLDivElement>()

  const activeTab = activeStage > 0 ? STAGE_TO_TAB[activeStage] ?? null : null
  useEffect(() => {
    if (activeStage < 1) return
    saveSaleStage(storageKey, activeStage)
    window.dispatchEvent(
      new CustomEvent('vsa-stage-change', { detail: { stage: activeStage, storageKey } })
    )
  }, [activeStage, storageKey])

  const selectStage = useCallback((stageId: number) => {
    setActiveStage(stageId)
    setModalStep(null)
    if (stageId >= 1) {
      requestAnimationFrame(() => scrollToContentPanel())
    }
  }, [])

  const navigateToStage = useCallback(
    (tabId: string) => {
      const stage = TAB_TO_STAGE[tabId]
      if (!stage) return
      selectStage(stage)
    },
    [selectStage]
  )

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

  const tabData = activeTab ? STEPS_BY_TAB[activeTab] : null
  const openStep =
    tabData && modalStep ? tabData.steps.find((s) => s.number === modalStep) ?? null : null

  return (
    <section className="vsa-guide" id="como-vas-venta" aria-labelledby={`${groupId}-title`}>
      <div className="vsa-guide__container">
        <div ref={headerRef} className="vsa-guide__header reveal">
          <h2 id={`${groupId}-title`} className="vsa-guide__header-title">
            {title}
          </h2>
          <p id={`${groupId}-subtitle`} className="vsa-guide__header-desc">
            {subtitle}
          </p>
        </div>

        <div
          className="vsa-guide__chips-scroll"
          role="radiogroup"
          aria-labelledby={`${groupId}-title`}
          aria-describedby={`${groupId}-subtitle`}
        >
          <div className="vsa-guide__chips">
            {STAGE_OPTIONS.map((opt) => {
              const isActive = activeStage === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`vsa-guide__chip${isActive ? ' vsa-guide__chip--active' : ''}`}
                  onClick={() => selectStage(opt.id)}
                >
                  <span className="vsa-guide__chip-num">{opt.id}</span>
                  <span className="vsa-guide__chip-text">
                    <span className="vsa-guide__chip-short">{opt.short}</span>
                    <span className="vsa-guide__chip-name">{opt.name}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {activeStage === 0 ? (
          <p className="vsa-guide__placeholder">
            Selecciona una etapa para ver tus próximos pasos.
          </p>
        ) : tabData ? (
          <div ref={contentRef} id="guia-etapas" className="vsa-guide__panel reveal" key={activeTab}>
            <div id="vsa-sale-guide-content" className="vsa-guide__stage-intro" aria-live="polite">
              <p className="vsa-guide__stage-intro-eyebrow">
                <span className="vsa-guide__stage-intro-etapa">{tabData.etapa}</span>
                <span className="vsa-guide__stage-intro-sep" aria-hidden="true"> · </span>
                <span className="vsa-guide__stage-intro-title">{tabData.title}</span>
              </p>
              <p className="vsa-guide__stage-intro-lead">{tabData.quote}</p>
              <p
                className="vsa-guide__stage-intro-body"
                dangerouslySetInnerHTML={{ __html: tabData.quoteDesc }}
              />
            </div>
            <div className="vsa-guide__steps">
              <div className="vsa-guide__cards-grid">
                {tabData.steps.map((step) => (
                  <StepCard
                    key={step.number}
                    step={step}
                    meta={getStepCardMeta(step, checkVersion)}
                    onOpen={() => setModalStep(step.number)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

      </div>

      {openStep && tabData && (
        <StepModal
          step={openStep}
          tabData={tabData}
          onClose={() => setModalStep(null)}
          onCheckChange={() => setCheckVersion((v) => v + 1)}
          onNavigateStage={navigateToStage}
          onOpenFicha={() => setFichaOpen(true)}
          onNavigateStep={(stepNumber) => setModalStep(stepNumber)}
        />
      )}

      <Suspense fallback={null}>
        {fichaOpen && <FichaCreator open={fichaOpen} onClose={() => setFichaOpen(false)} />}
      </Suspense>
    </section>
  )
}

/** @deprecated Use VsaSaleGuide */
export const VsaGuide = VsaSaleGuide
