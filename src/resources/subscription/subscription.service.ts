import Stripe from '@/config/stripe'
import {
  createSubscriptionProps,
  SubscriptionPriceLookupKey,
  SubscriptionStatus,
} from './subscription.interface'
import User, { RoleEnum } from '../user/user.interface'
import { SubscriptionModel } from './subscription.model'
import UserModel from '../user/user.model'
import HttpException from '@/utils/exceptions/http.exception'
import {
  sendTrialEndingEmail,
  sendPaymentFailedEmail,
} from '@/utils/shared/email'

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

  public async handleWebhook(event: { type: string; data: { object: any } }) {
    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        await this.handleTrialWillEnd(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object)
        break
      default:
        break
    }
  }

  private async handleTrialWillEnd(subscription: any) {
    const sub = await SubscriptionModel.findOne({
      subscriptionId: subscription.id,
    }).populate('user')
    if (!sub?.user) return
    const user = sub.user as User
    const trialEndDate = subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toLocaleDateString()
      : ''
    await sendTrialEndingEmail({
      recipient: user.email,
      firstName: user.firstName,
      trialEndDate,
    })
  }

  private async handlePaymentSucceeded(invoice: any) {
    if (!invoice.subscription) return
    const sub = await SubscriptionModel.findOne({
      subscriptionId: invoice.subscription,
    }).populate('user')
    if (!sub) return
    await SubscriptionModel.updateOne(
      { subscriptionId: invoice.subscription },
      { status: SubscriptionStatus.ACTIVE }
    )
    const user = sub.user as User
    if (user?.role !== RoleEnum.Member) {
      await UserModel.findByIdAndUpdate(user._id, { role: RoleEnum.Member })
    }
  }

  private async handlePaymentFailed(invoice: any) {
    if (!invoice.subscription) return
    await SubscriptionModel.updateOne(
      { subscriptionId: invoice.subscription },
      { status: SubscriptionStatus.PAST_DUE }
    )
    const sub = await SubscriptionModel.findOne({
      subscriptionId: invoice.subscription,
    }).populate('user')
    if (sub?.user) {
      const user = sub.user as User
      await sendPaymentFailedEmail({
        recipient: user.email,
        firstName: user.firstName,
      })
    }
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const sub = await SubscriptionModel.findOne({
      subscriptionId: subscription.id,
    })
    if (!sub) return
    await SubscriptionModel.updateOne(
      { subscriptionId: subscription.id },
      {
        status: SubscriptionStatus.CANCELED,
        endedAt: new Date(),
      }
    )
    await UserModel.findOneAndUpdate(
      { stripeCustomerId: subscription.customer },
      { role: RoleEnum.Guest }
    )
  }

  private async handleSubscriptionUpdated(subscription: any) {
    await SubscriptionModel.updateOne(
      { subscriptionId: subscription.id },
      {
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtEndOfPeriod: subscription.cancel_at_period_end ?? false,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
      }
    )
  }
}

export default SubscriptionService
