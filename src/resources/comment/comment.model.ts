import createSchema from '@/utils/shared/createSchema'
import { model, Schema } from 'mongoose'
import { Comment } from './comment.interface'

// Comment Schema and Model
const CommentSchema = createSchema({
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post',
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
})

CommentSchema.index({ post: 1, user: 1 }, { unique: true })

export const CommentModel = model<Comment>('Comment', CommentSchema)
