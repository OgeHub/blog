import { Schema, model } from 'mongoose'
import { Comment, Post } from '@/resources/post/post.interface'

const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post',
    },

    content: {
        type: String,
        required: true,
    },
})

export const CommentModel = model<Comment>('Comment', CommentSchema)

const PostSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
})

export default model<Post>('Post', PostSchema)
