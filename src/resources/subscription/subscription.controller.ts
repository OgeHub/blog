import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import SubscriptionService from './subscription.service'
import authenticated from '@/middleware/authenticated.middleware'
import validate from './subscription.validation'
import validationMiddleware from '@/middleware/validation.middleware'

class SubscriptionController implements Controller {
  public path = '/subscriptions'
  public router = Router()
  private subscriptionService = new SubscriptionService()

  constructor() {
    this.initializeRoutes()
  }

  /** Initialize all endpoints */
  private initializeRoutes(): void {
    this.router.use(authenticated)

    this.router.get(`${this.path}/prices`, this.getPrices)
    this.router.get(`${this.path}/client-secret`, this.getClientSecret)
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.createSubscription),
      this.createSubscription
    )
  }

  /**Get prices */
  private getPrices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const prices = await this.subscriptionService.getPrices()

      return res.status(200).json({
        status: 'success',
        message: 'Prices retrieved successfully',
        data: prices,
      })
    } catch (error: any) {
      next(error)
    }
  }

  private getClientSecret = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const clientSecret = await this.subscriptionService.getClientSecret(
        req.user
      )

      return res.status(200).json({
        status: 'success',
        message: 'Client secret retrieved successfully',
        data: clientSecret,
      })
    } catch (error: any) {
      next(error)
    }
  }

  private createSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      await this.subscriptionService.createSubscription({
        priceId: req.body.priceId,
        paymentMethodId: req.body.paymentMethodId,
        user: req.user,
      })

      return res.status(200).json({
        status: 'success',
        message: 'Subscription created successfully',
      })
    } catch (error: any) {
      next(error)
    }
  }
}

export default SubscriptionController
