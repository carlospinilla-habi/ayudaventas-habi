/**
 * Interpreta el valor de precio capturado en el formulario (puede incluir símbolos de moneda).
 */
export function parseAskPriceFromForm(raw: string | undefined): number {
  if (!raw || typeof raw !== 'string') return 0
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return 0
  const n = Number.parseInt(digits, 10)
  return Number.isFinite(n) ? n : 0
}
