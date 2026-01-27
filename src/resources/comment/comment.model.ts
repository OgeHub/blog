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

CommentSchema.index({ post: 1 })

CommentSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'comment',
})

CommentSchema.virtual('claps', {
  ref: 'Clap',
  localField: '_id',
  foreignField: 'target',
})
export const CommentModel = model<Comment>('Comment', CommentSchema)
