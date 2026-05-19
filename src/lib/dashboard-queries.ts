import { supabase } from './supabase'

export type SourceFilter = 'all' | 'ayudaventas' | 'resgestion'

// ─── Types ─────────────────────────────────────────────
export interface LeadRow {
  id: string
  created_at: string
  source: string | null
  user_interest: string | null
  ficha_created: boolean | null
  oferta_requested: boolean | null
  habimetro_requested: boolean | null
  active_stage: number | null
  nombre: string | null
  email: string | null
  whatsapp: string | null
  ciudad: string | null
  barrio: string | null
  direccion: string | null
  tipo_inmueble: string | null
  precio_venta: string | null
  relacion_inmueble: string | null
  tiempo_vendiendo: string | null
  inmo_status: string | null
  inmo_completed_at: string | null
  checklist_total: number
  checklist_done: number
}

export interface KPIs {
  totalLeads: number
  byInterest: Record<string, number>
  ofertaRequested: number
  inmoCompleted: number
  fichaCreated: number
  byStage: Record<number, number>
  bySource: Record<string, number>
}

export interface LeadActivity {
  user_interest: string | null
  interest_selected_at: string | null
  ficha_created: boolean | null
  ficha_created_at: string | null
  oferta_requested: boolean | null
  oferta_requested_at: string | null
  habimetro_requested: boolean | null
  habimetro_requested_at: string | null
}

export interface ChecklistStep {
  step_number: string
  done: number
  total: number
}

export interface LeadDetail {
  contact: {
    nombre: string | null
    email: string | null
    whatsapp: string | null
    relacion_inmueble: string | null
  }
  property: {
    ciudad: string | null
    barrio: string | null
    direccion: string | null
    tipo_inmueble: string | null
    area_m2: string | null
    habitaciones: string | null
    banos_completos: string | null
    banos_medios: string | null
    estrato: string | null
    precio_venta: string | null
    valor_administracion: string | null
    estado_vivienda: string | null
    parqueaderos: string | null
    antiguedad: string | null
    motivo_venta: string | null
    tiempo_vendiendo: string | null
    torre: string | null
    piso_inmueble: string | null
    numero_vivienda: string | null
    tiene_ascensor: string | null
    ultimo_piso: string | null
    zonas: string | null
    zonas_comunes: string | null
    tipo_parqueadero: string | null
    organizacion_parqueadero: string | null
    gravamen: string | null
    tipo_gravamen: string | null
    obra_gris: string | null
  }
  ficha: {
    titulo: string | null
    descripcion: string | null
    features: string | null
  }
  activity: LeadActivity | null
  checklistSteps: ChecklistStep[]
  source: 'inmo_form_submissions' | 'properties' | 'none'
}

// ─── Display helpers ───────────────────────────────────
export function formatArrayField(value: unknown): string | null {
  if (Array.isArray(value)) {
    const parts = value.filter((v) => typeof v === 'string' && v.trim()).map(String)
    return parts.length > 0 ? parts.join(', ') : null
  }
  if (typeof value === 'string' && value.trim()) return value.trim()
  return null
}

export function formatCiudadDisplay(
  ciudad: string | null | undefined,
  barrio: string | null | undefined
): string | null {
  const c = ciudad?.trim()
  const b = barrio?.trim()
  if (!c) return b || null
  if (c === 'Otra' && b) return `Otra · ${b}`
  return c
}

function applySourceFilter<T extends { source?: string | null }>(
  rows: T[],
  source: SourceFilter
): T[] {
  if (source === 'all') return rows
  return rows.filter((r) => r.source === source)
}

const INMO_LIST_FIELDS =
  'user_id, status, completed_at, ciudad, barrio, direccion, tipo_inmueble, precio_venta, nombre_contacto, email_contacto, telefono_contacto, relacion_inmueble, tiempo_vendiendo'

const PROPS_LIST_FIELDS = 'user_id, ciudad, barrio, direccion, tipo_inmueble, precio_venta'

// ─── Fetch all leads (joined) ──────────────────────────
export async function fetchLeads(source: SourceFilter): Promise<LeadRow[]> {
  const { data: users } = await supabase
    .from('users')
    .select('id, created_at, source')
    .order('created_at', { ascending: false })

  if (!users?.length) return []

  const filteredUsers = applySourceFilter(users, source)
  const userIds = filteredUsers.map((u) => u.id)

  const [activityRes, stageRes, contactRes, propsRes, inmoRes, checklistRes] =
    await Promise.all([
      supabase.from('user_activity').select('*').in('user_id', userIds),
      supabase.from('sale_stage').select('*').in('user_id', userIds),
      supabase.from('contact_info').select('*').in('user_id', userIds),
      supabase.from('properties').select(PROPS_LIST_FIELDS).in('user_id', userIds),
      supabase.from('inmo_form_submissions').select(INMO_LIST_FIELDS).in('user_id', userIds),
      supabase.from('checklist_progress').select('user_id, checks').in('user_id', userIds),
    ])

  const activityMap = new Map((activityRes.data ?? []).map((r) => [r.user_id, r]))
  const stageMap = new Map((stageRes.data ?? []).map((r) => [r.user_id, r]))
  const contactMap = new Map((contactRes.data ?? []).map((r) => [r.user_id, r]))
  const propsMap = new Map((propsRes.data ?? []).map((r) => [r.user_id, r]))
  const inmoMap = new Map((inmoRes.data ?? []).map((r) => [r.user_id, r]))

  const checklistMap = new Map<string, { total: number; done: number }>()
  for (const row of checklistRes.data ?? []) {
    const checks: boolean[] = row.checks ?? []
    const prev = checklistMap.get(row.user_id) ?? { total: 0, done: 0 }
    checklistMap.set(row.user_id, {
      total: prev.total + checks.length,
      done: prev.done + checks.filter(Boolean).length,
    })
  }

  return filteredUsers.map((u) => {
    const act = activityMap.get(u.id)
    const stage = stageMap.get(u.id)
    const contact = contactMap.get(u.id)
    const props = propsMap.get(u.id)
    const inmo = inmoMap.get(u.id)
    const cl = checklistMap.get(u.id) ?? { total: 0, done: 0 }

    return {
      id: u.id,
      created_at: u.created_at,
      source: u.source,
      user_interest: act?.user_interest ?? null,
      ficha_created: act?.ficha_created ?? null,
      oferta_requested: act?.oferta_requested ?? null,
      habimetro_requested: act?.habimetro_requested ?? null,
      active_stage: stage?.active_stage ?? null,
      nombre: contact?.nombre ?? inmo?.nombre_contacto ?? null,
      email: contact?.email ?? inmo?.email_contacto ?? null,
      whatsapp: contact?.whatsapp ?? inmo?.telefono_contacto ?? null,
      ciudad: props?.ciudad ?? inmo?.ciudad ?? null,
      barrio: props?.barrio ?? inmo?.barrio ?? null,
      direccion: props?.direccion ?? inmo?.direccion ?? null,
      tipo_inmueble: props?.tipo_inmueble ?? inmo?.tipo_inmueble ?? null,
      precio_venta: props?.precio_venta ?? inmo?.precio_venta ?? null,
      relacion_inmueble: inmo?.relacion_inmueble ?? null,
      tiempo_vendiendo: inmo?.tiempo_vendiendo ?? null,
      inmo_status: inmo?.status ?? null,
      inmo_completed_at: inmo?.completed_at ?? null,
      checklist_total: cl.total,
      checklist_done: cl.done,
    }
  })
}

export function computeKPIs(leads: LeadRow[]): KPIs {
  const byInterest: Record<string, number> = {}
  const byStage: Record<number, number> = {}
  const bySource: Record<string, number> = {}
  let ofertaRequested = 0
  let inmoCompleted = 0
  let fichaCreated = 0

  for (const lead of leads) {
    if (lead.user_interest) {
      byInterest[lead.user_interest] = (byInterest[lead.user_interest] ?? 0) + 1
    }
    if (lead.active_stage) {
      byStage[lead.active_stage] = (byStage[lead.active_stage] ?? 0) + 1
    }
    const src = lead.source ?? 'unknown'
    bySource[src] = (bySource[src] ?? 0) + 1

    if (lead.oferta_requested) ofertaRequested++
    if (lead.inmo_status === 'completed') inmoCompleted++
    if (lead.ficha_created) fichaCreated++
  }

  return {
    totalLeads: leads.length,
    byInterest,
    ofertaRequested,
    inmoCompleted,
    fichaCreated,
    byStage,
    bySource,
  }
}

function hasMeaningfulCiudad(lead: LeadRow): boolean {
  if (!lead.ciudad?.trim()) return Boolean(lead.barrio?.trim())
  if (lead.ciudad.trim() === 'Otra') return Boolean(lead.barrio?.trim())
  return true
}

export function computeMaturity(lead: LeadRow): number {
  let score = 0
  if (lead.active_stage) score += lead.active_stage * 15
  if (lead.checklist_total > 0) {
    score += Math.round((lead.checklist_done / lead.checklist_total) * 20)
  }
  if (lead.nombre || lead.email || lead.whatsapp) score += 15
  if (lead.ficha_created) score += 15
  if (lead.inmo_status === 'completed') score += 15
  if (lead.oferta_requested) score += 10
  if (hasMeaningfulCiudad(lead)) score += 5
  if (lead.precio_venta) score += 5
  return Math.min(score, 100)
}

export type Segment = 'urgente' | 'cambiar' | 'sin-afan' | 'legal' | 'sin-interes'

export function getSegment(lead: LeadRow): Segment {
  const interest = lead.user_interest
  if (interest === 'urgente') return 'urgente'
  if (interest === 'cambiar') return 'cambiar'
  if (interest === 'sin-afan') return 'sin-afan'
  if (interest === 'legal') return 'legal'
  return 'sin-interes'
}

export const SEGMENT_LABELS: Record<Segment, string> = {
  urgente: 'Vender rápido',
  cambiar: 'Servicio inmobiliario',
  'sin-afan': 'Vender por mi cuenta',
  legal: 'Asesoría legal',
  'sin-interes': 'Sin interés definido',
}

export const STAGE_LABELS: Record<number, string> = {
  1: 'Preparando la venta',
  2: 'Publicando y difundiendo',
  3: 'Negociando',
  4: 'Cerrando la venta',
}

export const INTEREST_LABELS: Record<string, string> = {
  'sin-afan': 'Vender por mi cuenta',
  urgente: 'Vender rápido',
  cambiar: 'Cambiar de casa',
  legal: 'Asesoría legal',
}

export interface TableFilters {
  interest?: string
  stage?: number
  inmo?: 'completed' | 'in_progress' | 'none'
  oferta?: boolean
  ficha?: boolean
}

export async function fetchLeadDetail(userId: string): Promise<LeadDetail> {
  const [inmoRes, propsRes, contactRes, activityRes, checklistRes] = await Promise.all([
    supabase.from('inmo_form_submissions').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('properties').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('contact_info').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_activity').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('checklist_progress').select('step_number, checks').eq('user_id', userId),
  ])

  const inmo = inmoRes.data ?? null
  const props = propsRes.data ?? null
  const contact = contactRes.data ?? null
  const act = activityRes.data ?? null

  const pickInmo = (key: string): string | null => {
    const v = inmo?.[key]
    return typeof v === 'string' && v.trim() ? v : null
  }
  const pickProp = (key: string): string | null => {
    const v = props?.[key]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number') return String(v)
    return null
  }
  const pickInmoArr = (key: string): string | null =>
    formatArrayField(inmo?.[key] ?? null)
  const pickPropArr = (key: string): string | null =>
    formatArrayField(props?.[key] ?? null)

  const gravamen = pickInmo('gravamen')
  const tipoGravamen = pickInmo('tipo_gravamen')
  const gravamenDisplay =
    gravamen === 'Sí' && tipoGravamen
      ? `${gravamen} (${tipoGravamen})`
      : gravamen

  const property: LeadDetail['property'] = {
    ciudad: pickInmo('ciudad') ?? pickProp('ciudad'),
    barrio: pickInmo('barrio') ?? pickProp('barrio'),
    direccion: pickInmo('direccion') ?? pickProp('direccion'),
    tipo_inmueble: pickInmo('tipo_inmueble') ?? pickProp('tipo_inmueble'),
    area_m2: pickInmo('area_m2') ?? pickProp('area_m2'),
    habitaciones: pickInmo('habitaciones') ?? pickProp('habitaciones'),
    banos_completos: pickInmo('banos_completos') ?? pickProp('banos'),
    banos_medios: pickInmo('banos_medios'),
    estrato: pickInmo('estrato') ?? pickProp('estrato'),
    precio_venta: pickInmo('precio_venta') ?? pickProp('precio_venta'),
    valor_administracion: pickInmo('valor_administracion') ?? pickProp('admin_mes'),
    estado_vivienda: pickInmo('estado_vivienda'),
    parqueaderos: pickInmo('parqueaderos') ?? pickProp('parqueaderos'),
    antiguedad: pickInmo('antiguedad') ?? pickProp('antiguedad'),
    motivo_venta: pickInmo('motivo_venta'),
    tiempo_vendiendo: pickInmo('tiempo_vendiendo'),
    torre: pickInmo('torre'),
    piso_inmueble: pickInmo('piso'),
    numero_vivienda: pickInmo('numero_vivienda'),
    tiene_ascensor: pickInmo('tiene_ascensor'),
    ultimo_piso: pickInmo('ultimo_piso'),
    zonas: pickInmoArr('zonas'),
    zonas_comunes: pickInmoArr('zonas_comunes'),
    tipo_parqueadero: pickInmo('tipo_parqueadero'),
    organizacion_parqueadero: pickInmo('organizacion_parqueadero'),
    gravamen: gravamenDisplay,
    tipo_gravamen: tipoGravamen,
    obra_gris: pickInmo('obra_gris'),
  }

  const source: LeadDetail['source'] = inmo
    ? 'inmo_form_submissions'
    : props
      ? 'properties'
      : 'none'

  const checklistSteps: ChecklistStep[] = (checklistRes.data ?? []).map((row) => {
    const checks: boolean[] = row.checks ?? []
    return {
      step_number: String(row.step_number),
      done: checks.filter(Boolean).length,
      total: checks.length,
    }
  })

  const activity: LeadActivity | null = act
    ? {
        user_interest: act.user_interest ?? null,
        interest_selected_at: act.interest_selected_at ?? null,
        ficha_created: act.ficha_created ?? null,
        ficha_created_at: act.ficha_created_at ?? null,
        oferta_requested: act.oferta_requested ?? null,
        oferta_requested_at: act.oferta_requested_at ?? null,
        habimetro_requested: act.habimetro_requested ?? null,
        habimetro_requested_at: act.habimetro_requested_at ?? null,
      }
    : null

  return {
    contact: {
      nombre: contact?.nombre ?? pickInmo('nombre_contacto'),
      email: contact?.email ?? pickInmo('email_contacto'),
      whatsapp: contact?.whatsapp ?? pickInmo('telefono_contacto'),
      relacion_inmueble: pickInmo('relacion_inmueble'),
    },
    property,
    ficha: {
      titulo: pickProp('titulo'),
      descripcion: pickProp('descripcion'),
      features: pickPropArr('features'),
    },
    activity,
    checklistSteps,
    source,
  }
}
