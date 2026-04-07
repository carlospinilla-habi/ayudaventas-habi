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
  active_stage: number | null
  nombre: string | null
  email: string | null
  whatsapp: string | null
  ciudad: string | null
  tipo_inmueble: string | null
  precio_venta: string | null
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

// ─── Helpers ───────────────────────────────────────────
function applySourceFilter<T extends { source?: string | null }>(
  rows: T[],
  source: SourceFilter
): T[] {
  if (source === 'all') return rows
  return rows.filter((r) => r.source === source)
}

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
      supabase.from('properties').select('user_id, ciudad, tipo_inmueble, precio_venta').in('user_id', userIds),
      supabase.from('inmo_form_submissions').select('user_id, status, completed_at, ciudad, tipo_inmueble, precio_venta').in('user_id', userIds),
      supabase.from('checklist_progress').select('user_id, checks').in('user_id', userIds),
    ])

  const activityMap = new Map(
    (activityRes.data ?? []).map((r) => [r.user_id, r])
  )
  const stageMap = new Map(
    (stageRes.data ?? []).map((r) => [r.user_id, r])
  )
  const contactMap = new Map(
    (contactRes.data ?? []).map((r) => [r.user_id, r])
  )
  const propsMap = new Map(
    (propsRes.data ?? []).map((r) => [r.user_id, r])
  )
  const inmoMap = new Map(
    (inmoRes.data ?? []).map((r) => [r.user_id, r])
  )

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
      active_stage: stage?.active_stage ?? null,
      nombre: contact?.nombre ?? null,
      email: contact?.email ?? null,
      whatsapp: contact?.whatsapp ?? null,
      ciudad: props?.ciudad ?? inmo?.ciudad ?? null,
      tipo_inmueble: props?.tipo_inmueble ?? inmo?.tipo_inmueble ?? null,
      precio_venta: props?.precio_venta ?? inmo?.precio_venta ?? null,
      inmo_status: inmo?.status ?? null,
      inmo_completed_at: inmo?.completed_at ?? null,
      checklist_total: cl.total,
      checklist_done: cl.done,
    }
  })
}

// ─── Compute KPIs from leads ───────────────────────────
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

// ─── Maturity score for profiling ──────────────────────
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
  if (lead.ciudad) score += 5
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
