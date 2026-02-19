import { Document } from 'mongoose'
import User from '../user/user.interface'
export enum SubscriptionPriceLookupKey {
  MONTHLY = 'monthly_membership',
  YEARLY = 'yearly_membership',
}

export interface createSubscriptionProps {
  priceId: string
  paymentMethodId: string
  user: User
}

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
}

export interface Subscription extends Document {
  user: string
  stripeCustomerId: string
  subscriptionId: string
  priceId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialEnd?: Date
  canceledAt?: Date
  cancelAtEndOfPeriod: boolean
  liveMode: boolean
}
