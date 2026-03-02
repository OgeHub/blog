import createSchema from '@/utils/shared/createSchema'
import { model, Schema } from 'mongoose'

const processedWebhookSchema = createSchema({
  eventId: { type: String, required: true, unique: true },
  processedAt: { type: Date, default: Date.now },
})

processedWebhookSchema.index({ eventId: 1 }, { unique: true })

export const ProcessedWebhookModel = model(
  'ProcessedWebhook',
  processedWebhookSchema
)
