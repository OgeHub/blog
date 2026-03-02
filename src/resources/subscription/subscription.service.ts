import Stripe from '@/config/stripe'
import {
  createSubscriptionProps,
  SubscriptionPriceLookupKey,
  SubscriptionStatus,
} from './subscription.interface'
import User, { RoleEnum } from '../user/user.interface'
import { SubscriptionModel } from './subscription.model'
import HttpException from '@/utils/exceptions/http.exception'

class SubscriptionService {
  private stripe = new Stripe()

  public async getPrices() {
    const [monthly, yearly] = await Promise.all([
      this.stripe.getPriceByLookupKey(SubscriptionPriceLookupKey.MONTHLY),
      this.stripe.getPriceByLookupKey(SubscriptionPriceLookupKey.YEARLY),
    ])

    const prices = [monthly, yearly]

    const formatted = prices.map(
      (price: {
        id: string
        unit_amount: number
        currency: string
        lookup_key: string
      }) => {
        return {
          id: price.id,
          amount: price.unit_amount / 100,
          currency: price.currency.toUpperCase(),
          frequency: price.lookup_key,
        }
      }
    )

    return formatted
  }

  public async getClientSecret(user: User) {
    let customerId = user.stripeCustomerId

    if (!customerId) {
      customerId = await this.stripe.createCustomer({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      })

      user.stripeCustomerId = customerId
      await user.save()
    }

    const clientSecret = await this.stripe.createSetUpIntent(customerId)

    return { clientSecret }
  }

  public async createSubscription(payload: createSubscriptionProps) {
    const { priceId, paymentMethodId, user } = payload

    const subscriptionExists = await SubscriptionModel.findOne({
      user: user._id,
      priceId,
      status: {
        $in: [
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.TRIALING,
          SubscriptionStatus.PAST_DUE,
        ],
      },
    })

    if (subscriptionExists) {
      throw new HttpException(400, 'Subscription already exists')
    }

    const subscription = await this.stripe.createSubscription({
      priceId,
      customerId: user.stripeCustomerId,
      paymentMethodId,
      userId: String(user._id),
    })

    // Save subscription to database
    await SubscriptionModel.create({
      user: String(user._id),
      stripeCustomerId: user.stripeCustomerId,
      subscriptionId: subscription.id,
      priceId,
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtEndOfPeriod: subscription.cancel_at_period_end,
      liveMode: subscription.livemode,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : undefined,
    })

    // update user status to member
    user.role = RoleEnum.Member
    await user.save()
  }

  // TODO: implement webhooks to listen for subscription
  // customer.subscription.trial_will_end
  // invoice.payment_succeeded
  // invoice.payment_failed
  // customer.subscription.deleted
  // customer.subscription.updated
}

export default SubscriptionService
