import {
  syncProperties,
  syncContactInfo,
  syncActivity,
  syncSaleStage,
  syncChecklist,
} from './supabase'

/**
 * Fire-and-forget sync: calls the sync function in the background
 * without blocking the UI. Errors are swallowed and logged.
 */
function fireAndForget(fn: () => Promise<void>): void {
  fn().catch((err) => console.warn('[storage-sync]', err))
}

/**
 * Save ficha creator data to localStorage AND sync property +
 * contact data to Supabase in the background.
 */
export function saveFichaData(key: string, data: Record<string, unknown>): void {
  localStorage.setItem(key, JSON.stringify(data))

  fireAndForget(async () => {
    await syncProperties(data)
    const { nombre, email, whatsapp } = data as Record<string, string>
    if (nombre || email || whatsapp) {
      await syncContactInfo({ nombre, email, whatsapp })
    }
  })
}

/**
 * Save user interest selection to localStorage AND sync to Supabase.
 */
export function saveUserInterest(value: string): void {
  localStorage.setItem('user-interest', value)
  fireAndForget(() => syncActivity('user_interest', value))
}

/**
 * Save the active sale stage to localStorage AND sync to Supabase.
 */
export function saveSaleStage(storageKey: string, stage: number): void {
  localStorage.setItem(storageKey, String(stage))
  fireAndForget(() => syncSaleStage(stage))
}

/**
 * Save checklist progress to localStorage AND sync to Supabase.
 */
export function saveChecklistProgress(stepNumber: string, checks: boolean[]): void {
  localStorage.setItem(`vsa-checklist-${stepNumber}`, JSON.stringify(checks))
  fireAndForget(() => syncChecklist(stepNumber, checks))
}

/**
 * Track that the user created a ficha (boolean flag).
 */
export function trackFichaCreated(): void {
  fireAndForget(() => syncActivity('ficha_created', true))
}

/**
 * Track that the user opened the "Solicitar oferta" modal.
 */
export function trackOfertaRequested(): void {
  fireAndForget(() => syncActivity('oferta_requested', true))
}

/**
 * Track that the user opened the Habimetro flow.
 */
export function trackHabimetroRequested(): void {
  fireAndForget(() => syncActivity('habimetro_requested', true))
}
