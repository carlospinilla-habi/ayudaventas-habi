import { faker } from '@faker-js/faker'
import {
  COLOMBIA_LEAD_COUNTRY,
  SELLERS_MIDDLEWARE_SOURCE_ID,
  SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
  SELLERS_STRATEGY_HELP_TO_SELL,
} from '@/services/leads/constants'
import { buildInmoFormDetailFields } from '@/services/leads/inmoFormDetailFields'
import { postSellersMiddleware } from '@/services/leads/middleware'
import type { SellersMiddlewarePayload } from '@/services/leads/types'

describe('postSellersMiddleware', () => {
  it('should POST JSON with x-api-key', async () => {
    const url = faker.internet.url({ appendSlash: false })
    const apiKey = faker.string.alphanumeric(24)
    const payload: SellersMiddlewarePayload = {
      ...buildInmoFormDetailFields({}),
      source_id: SELLERS_MIDDLEWARE_SOURCE_ID,
      sub_source_id: SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
      country: COLOMBIA_LEAD_COUNTRY,
      strategy: SELLERS_STRATEGY_HELP_TO_SELL,
      homologated_address: faker.location.streetAddress(),
      latitude: 0,
      longitude: 0,
    }
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true })
    await postSellersMiddleware(payload, apiKey, url, fetchImpl as unknown as typeof fetch)
    expect(fetchImpl).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      })
    )
  })

  it('should throw when HTTP not ok', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 502 })
    await expect(
      postSellersMiddleware(
        {
          ...buildInmoFormDetailFields({}),
          source_id: SELLERS_MIDDLEWARE_SOURCE_ID,
          sub_source_id: SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
          country: COLOMBIA_LEAD_COUNTRY,
          strategy: SELLERS_STRATEGY_HELP_TO_SELL,
          homologated_address: 'b',
          latitude: 0,
          longitude: 0,
        },
        'k',
        'https://x.test',
        fetchImpl as unknown as typeof fetch
      )
    ).rejects.toThrow('Middleware HTTP 502')
  })
})
