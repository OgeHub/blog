import createSchema from '@/utils/shared/createSchema'
import { model, Schema } from 'mongoose'
import { Reply } from './reply.interface'

const replySchema = createSchema({
    content: { type: String, required: true },
    comment: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

replySchema.index({ comment: 1 })

export const ReplyModel = model<Reply>('Reply', replySchema)
