import Joi from 'joi'

/** Validates create subscription data */
const createSubscription = Joi.object({
  priceId: Joi.string().required(),
  paymentMethodId: Joi.string().required(),
}).strict()

export default {
  createSubscription,
}
