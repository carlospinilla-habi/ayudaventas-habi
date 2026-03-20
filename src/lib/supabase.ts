import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtvrdhponyoegxpiypbs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dnJkaHBvbnlvZWd4cGl5cGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjA2MDksImV4cCI6MjA4OTMzNjYwOX0.H9lySIM8l2HAK716drQYJCQPUTgUqcbiMewCip4Evzg'

const USER_ID_KEY = 'ayudaventas-user-id'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: (url, options = {}) => {
      const userId = localStorage.getItem(USER_ID_KEY)
      const headers = new Headers((options as RequestInit).headers)
      if (userId) headers.set('x-user-id', userId)
      return fetch(url, { ...options, headers })
    },
  },
})

export function getOrCreateUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

async function ensureUserRow(userId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .upsert({ id: userId }, { onConflict: 'id' })
  if (error) console.warn('[supabase] ensureUserRow:', error.message)
}

export async function syncProperties(data: Record<string, unknown>): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const row = {
    user_id: userId,
    titulo: data.titulo ?? null,
    tipo_inmueble: data.tipoInmueble ?? null,
    ciudad: data.ciudad ?? null,
    barrio: data.barrio ?? null,
    direccion: data.direccion ?? null,
    numero_apto: data.numeroApto ?? null,
    area_m2: data.areaM2 ?? null,
    antiguedad: data.antiguedad ?? null,
    parqueaderos: data.parqueaderos ?? null,
    banos: data.banos ?? null,
    habitaciones: data.habitaciones ?? null,
    piso: data.piso ?? null,
    estrato: data.estrato ?? null,
    admin_mes: data.adminMes ?? null,
    precio_venta: data.precioVenta ?? null,
    descripcion: data.descripcion ?? null,
    features: data.features ?? [],
    updated_at: new Date().toISOString(),
    updated_field: 'properties',
  }

  const { error } = await supabase
    .from('properties')
    .upsert(row, { onConflict: 'user_id' })
  if (error) console.warn('[supabase] syncProperties:', error.message)

  await supabase
    .from('users')
    .update({ updated_at: new Date().toISOString(), updated_field: 'properties' })
    .eq('id', userId)
}

export async function syncContactInfo(data: Record<string, unknown>): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const row = {
    user_id: userId,
    nombre: data.nombre ?? null,
    email: data.email ?? null,
    whatsapp: data.whatsapp ?? null,
    updated_at: new Date().toISOString(),
    updated_field: 'contact_info',
  }

  const { error } = await supabase
    .from('contact_info')
    .upsert(row, { onConflict: 'user_id' })
  if (error) console.warn('[supabase] syncContactInfo:', error.message)

  await supabase
    .from('users')
    .update({ updated_at: new Date().toISOString(), updated_field: 'contact_info' })
    .eq('id', userId)
}

export async function syncActivity(
  field: 'ficha_created' | 'oferta_requested' | 'habimetro_requested' | 'user_interest',
  value: boolean | string
): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const now = new Date().toISOString()
  const timestampField = field === 'user_interest' ? 'interest_selected_at' : `${field}_at`

  const row: Record<string, unknown> = {
    user_id: userId,
    [field]: value,
    [timestampField]: now,
    updated_at: now,
    updated_field: field,
  }

  const { error } = await supabase
    .from('user_activity')
    .upsert(row, { onConflict: 'user_id' })
  if (error) console.warn('[supabase] syncActivity:', error.message)

  await supabase
    .from('users')
    .update({ updated_at: now, updated_field: `activity.${field}` })
    .eq('id', userId)
}

export async function syncSaleStage(activeStage: number): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const now = new Date().toISOString()
  const row = {
    user_id: userId,
    active_stage: activeStage,
    updated_at: now,
    updated_field: `stage_${activeStage}`,
  }

  const { error } = await supabase
    .from('sale_stage')
    .upsert(row, { onConflict: 'user_id' })
  if (error) console.warn('[supabase] syncSaleStage:', error.message)

  await supabase
    .from('users')
    .update({ updated_at: now, updated_field: `sale_stage.${activeStage}` })
    .eq('id', userId)
}

export async function syncInmoFormSubmission(
  formData: Record<string, string | string[] | boolean>,
  isComplete = true
): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const now = new Date().toISOString()

  const toStr = (key: string) => {
    const v = formData[key]
    return typeof v === 'string' ? v : null
  }

  const toArr = (key: string) => {
    const v = formData[key]
    return Array.isArray(v) ? v : null
  }

  const row: Record<string, unknown> = {
    user_id: userId,
    status: isComplete ? 'completed' : 'in_progress',
    ciudad: toStr('ciudad'),
    barrio: toStr('barrio'),
    direccion: toStr('direccion'),
    tipo_inmueble: toStr('tipo_inmueble'),
    torre: toStr('torre'),
    piso: toStr('piso'),
    numero_vivienda: toStr('numero_vivienda'),
    tiene_ascensor: toStr('tiene_ascensor'),
    ultimo_piso: toStr('ultimo_piso'),
    relacion_inmueble: toStr('relacion_inmueble'),
    nombre_contacto: toStr('nombre_contacto'),
    email_contacto: toStr('email_contacto'),
    telefono_contacto: toStr('telefono_contacto'),
    acepta_terminos: !!formData['ciudad_checkbox'],
    antiguedad: toStr('antiguedad'),
    area_m2: toStr('area_m2'),
    habitaciones: toStr('habitaciones'),
    banos_completos: toStr('banos_completos'),
    banos_medios: toStr('banos_medios'),
    zonas: toArr('zonas') ?? (toStr('zonas') ? [toStr('zonas')!] : null),
    parqueaderos: toStr('parqueaderos'),
    tipo_parqueadero: toStr('tipo_parqueadero'),
    organizacion_parqueadero: toStr('organizacion_parqueadero'),
    precio_venta: toStr('precio_venta'),
    valor_administracion: toStr('valor_administracion'),
    obra_gris: toStr('obra_gris'),
    estrato: toStr('estrato'),
    gravamen: toStr('gravamen'),
    tipo_gravamen: toStr('tipo_gravamen'),
    estado_vivienda: toStr('estado_vivienda'),
    zonas_comunes: toArr('zonas_comunes'),
    motivo_venta: toStr('motivo_venta'),
    tiempo_vendiendo: toStr('tiempo_vendiendo'),
    updated_at: now,
    ...(isComplete ? { completed_at: now } : {}),
  }

  const { error } = await supabase
    .from('inmo_form_submissions')
    .upsert(row, { onConflict: 'user_id' })
  if (error) console.warn('[supabase] syncInmoFormSubmission:', error.message)

  if (isComplete) {
    await syncActivity('oferta_requested', true)
  }

  await supabase
    .from('users')
    .update({ updated_at: now, updated_field: 'inmo_form' })
    .eq('id', userId)
}

export async function syncChecklist(stepNumber: string, checks: boolean[]): Promise<void> {
  const userId = getOrCreateUserId()
  await ensureUserRow(userId)

  const now = new Date().toISOString()
  const row = {
    user_id: userId,
    step_number: stepNumber,
    checks,
    updated_at: now,
  }

  const { error } = await supabase
    .from('checklist_progress')
    .upsert(row, { onConflict: 'user_id,step_number' })
  if (error) console.warn('[supabase] syncChecklist:', error.message)

  await supabase
    .from('users')
    .update({ updated_at: now, updated_field: `checklist.${stepNumber}` })
    .eq('id', userId)
}
