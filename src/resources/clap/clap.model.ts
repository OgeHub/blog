import createSchema from '@/utils/shared/createSchema'
import { model, Schema } from 'mongoose'
import { Clap, TargetType } from './clap.interface'

// Clap Schema and Model
const ClapSchema = createSchema({
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetType',
    required: true,
  },
  targetType: {
    type: String,
    enum: Object.values(TargetType),
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  count: {
    type: Number,
    default: 1,
    max: 50,
  },
})

ClapSchema.index({ target: 1, user: 1 }, { unique: true })

export const ClapModel = model<Clap>('Clap', ClapSchema)
