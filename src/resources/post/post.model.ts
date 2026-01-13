import { Schema, model } from 'mongoose'
import { Clap, Comment, Post } from '@/resources/post/post.interface'
import createSchema from '@/utils/shared/createSchema'
import { AvatarSchema } from '../user/user.model'

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

const ClapSchema = createSchema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
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

ClapSchema.index({ post: 1, user: 1 }, { unique: true })

export const ClapModel = model<Clap>('Clap', ClapSchema)

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
})

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
})

PostSchema.virtual('claps', {
    ref: 'Clap',
    localField: '_id',
    foreignField: 'post',
})

export default model<Post>('Post', PostSchema)
