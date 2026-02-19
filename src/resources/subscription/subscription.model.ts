import createSchema from '@/utils/shared/createSchema'
import { model, Schema } from 'mongoose'
import { Subscription, SubscriptionStatus } from './subscription.interface'

const subscriptionSchema = createSchema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stripeCustomerId: { type: String, required: true },
  subscriptionId: { type: String, required: true, unique: true },
  priceId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    required: true,
  },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true },
  trialEnd: { type: Date },
  canceledAt: { type: Date },
  cancelAtEndOfPeriod: { type: Boolean, required: true },
  liveMode: { type: Boolean, required: true },
})

subscriptionSchema.index({ subscriptionId: 1, priceId: 1 }, { unique: true })

export const SubscriptionModel = model<Subscription>(
  'Subscription',
  subscriptionSchema
)
