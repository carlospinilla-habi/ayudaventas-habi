import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import { syncInmoFormSubmission } from '@/lib/supabase'
import { submitColombiaLeadThroughMiddleware } from './submitColombiaLead'

/**
 * Supabase (sin cambios) y registro middleware en paralelo; errores aislados vía catch interno.
 */
export async function runParallelInmoSubmission(formData: InmoFormData): Promise<void> {
  await Promise.all([
    syncInmoFormSubmission(formData).catch((e: unknown) => {
      console.warn('[InmoForm] submission error:', e)
    }),
    submitColombiaLeadThroughMiddleware(formData).catch((e: unknown) => {
      console.warn('[InmoForm] middleware lead error:', e)
    }),
  ])
}
