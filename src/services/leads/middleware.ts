import type { SellersMiddlewarePayload } from './types'

export async function postSellersMiddleware(
  payload: SellersMiddlewarePayload,
  apiKey: string,
  url: string,
  fetchImpl: typeof fetch
): Promise<void> {
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`Middleware HTTP ${res.status}`)
  }
}
