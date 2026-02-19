import { Schema, model } from 'mongoose'
import { Post, postStatus } from '@/resources/post/post.interface'
import createSchema from '@/utils/shared/createSchema'
import { AvatarSchema } from '../user/user.model'

// Post Schema and Model
const PostSchema = createSchema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },

  body: {
    type: String,
    required: true,
  },

  postAvatar: {
    type: AvatarSchema,
  },

  status: {
    type: String,
    enum: Object.values(postStatus),
  },
})

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
})

PostSchema.virtual('claps', {
  ref: 'Clap',
  localField: '_id',
  foreignField: 'target',
})

export default model<Post>('Post', PostSchema)
