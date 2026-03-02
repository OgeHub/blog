import logger from '@/utils/shared/customLogger'
import axios from 'axios'

interface CreateCustomer {
  name: string
  email: string
}

interface StripeCallProps {
  method: string
  endpoint: string
  payload?: string
  customHeader?: Record<string, string>
}

interface createStripeSubscriptionProps {
  customerId: string
  priceId: string
  paymentMethodId: string
  userId: string
}

class Stripe {
  private baseUrl: string
  private secret: string

  constructor() {
    this.baseUrl = process.env.STRIPE_BASE_URL as string
    this.secret = process.env.STRIPE_SECRET_KEY as string
  }

  private async stripeCall(payloadProps: StripeCallProps) {
    const { method, endpoint, payload, customHeader } = payloadProps

    const headers = {
      Authorization: `Bearer ${this.secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (customHeader) {
      Object.assign(headers, customHeader)
    }

    const response = await axios({
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers,
      data: payload,
    })

    return response.data
  }

  public async createCustomer(payload: CreateCustomer): Promise<string> {
    try {
      const params = new URLSearchParams()
      params.append('name', payload.name)
      params.append('email', payload.email)

      const response = await this.stripeCall({
        method: 'POST',
        endpoint: '/v1/customers',
        payload: params.toString(),
      })

      logger.info(`Stripe customer created with ID: ${response.id}`)
      return response.id
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  public async getPriceByLookupKey(lookupKey: string) {
    const params = new URLSearchParams()
    params.append('lookup_keys[]', lookupKey)
    params.append('expand[]', 'data.product')

    const response = await this.stripeCall({
      method: 'GET',
      endpoint: `/v1/prices?${params.toString()}`,
    })

    if (!response.data.length) {
      throw new Error('Price not found')
    }

    return response.data[0]
  }

  public async createSetUpIntent(customerId: string) {
    try {
      const params = new URLSearchParams()
      params.append('customer', customerId)

      const response = await this.stripeCall({
        method: 'POST',
        endpoint: '/v1/setup_intents',
        payload: params.toString(),
      })

      logger.info(`Stripe setup intent created for customer ID: ${customerId}`)

      return response.client_secret
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  public async createSubscription(payload: createStripeSubscriptionProps) {
    try {
      const { customerId, priceId, paymentMethodId, userId } = payload
      const params = new URLSearchParams()
      params.append('customer', customerId)
      params.append('items[0][price]', priceId)
      params.append('trial_period_days', '30')
      params.append('default_payment_method', paymentMethodId)

      const response = await this.stripeCall({
        method: 'POST',
        endpoint: '/v1/subscriptions',
        payload: params.toString(),
        customHeader: {
          'Idempotency-Key': `subscription-${userId}-${priceId}`,
        },
      })

      logger.info(
        `Stripe subscription created for customer ID: ${customerId} with subscription ID: ${response.id}`
      )

      return response
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  public async cancelSubscription(subscriptionId: string) {
    try {
      const response = await this.stripeCall({
        method: 'POST',
        endpoint: `/v1/subscriptions/${subscriptionId}/cancel`,
      })

      logger.info(`Stripe subscription cancelled with ID: ${subscriptionId}`)
      return response
    } catch (error: any) {
      throw error.response?.data || error
    }
  }

  public async resumeSubscription(subscriptionId: string) {
    try {
      const params = new URLSearchParams()
      params.append('cancel_at_period_end', 'false')

      const response = await this.stripeCall({
        method: 'POST',
        endpoint: `/v1/subscriptions/${subscriptionId}`,
        payload: params.toString(),
      })

      logger.info(`Stripe subscription resumed with ID: ${subscriptionId}`)
      return response
    } catch (error: any) {
      throw error.response?.data || error
    }
  }
}

export default Stripe
