import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import SubscriptionService from '@/resources/subscription/subscription.service'
import Stripe from 'stripe'
import logger from '@/utils/shared/customLogger'

class WebhookController implements Controller {
  public path = '/webhooks'
  public router = Router()
  private subscriptionService = new SubscriptionService()
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-02-25.clover',
    })
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/stripe`, this.handleStripeWebhook)
  }

  private handleStripeWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const sig = req.headers['stripe-signature'] as string

    if (!sig) {
      return res.status(400).send('Missing stripe-signature header')
    }

    let event: Stripe.Event

    try {
      const rawBody = (req as Request & { rawBody?: Buffer }).rawBody
      if (!rawBody) {
        logger.error('Webhook: raw body is required for signature verification')
        return res.status(400).send('Webhook raw body required')
      }

      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      )
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
      await this.subscriptionService.handleWebhook(event)
      return res.status(200).json({ received: true })
    } catch (error: any) {
      logger.error(`Webhook handler error: ${error.message}`)
      next(error)
    }
  }
}

export default WebhookController
