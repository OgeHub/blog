import mongoose from 'mongoose'
import { paginationQuery } from '../post/post.interface'
import {
    createCommentProps,
    deleteCommentProps,
    updateCommentProps,
} from './comment.interface'
import { CommentModel } from './comment.model'
import HttpException from '@/utils/exceptions/http.exception'
import { ReplyModel } from '../reply/reply.model'
import { author_selected_field } from '../user/user.interface'

class CommentService {
    public async addCommentToPost(payload: createCommentProps) {
        return await CommentModel.create(payload)
    }

    public async getCommentsByPostId(
        postId: string,
        pagination: paginationQuery
    ) {
        const { limit, cursor } = pagination

        const filter: Record<string, any> = { post: postId }
        if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }

        const comments = await CommentModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate([{ path: 'user', select: author_selected_field }])
            .exec()

        return {
            comments,
            cursor:
                comments.length > 0
                    ? comments[comments.length - 1]._id.toString()
                    : null,
            hasMore: comments.length >= limit,
        }
    }

    public async deleteComment(payload: deleteCommentProps) {
        const { commentId, user } = payload

        const comment = await CommentModel.findById(commentId).exec()

        if (!comment) throw new HttpException(404, 'Comment not found')

        if (comment.user._id.toString() !== user)
            throw new HttpException(
                403,
                'You can only delete your own comments'
            )

        // start a session for transaction
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            // Delete associated replies
            await ReplyModel.deleteMany({ comment: commentId })
                .session(session)
                .exec()

            await CommentModel.findByIdAndDelete(commentId)
                .session(session)
                .exec()

            await session.commitTransaction()
        } catch (error) {
            console.error('Error deleting comment and replies:', error)
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    public async updateComment(payload: updateCommentProps) {
        const { commentId, user, content } = payload

        const comment = await CommentModel.findById(commentId).exec()

        if (!comment) throw new HttpException(404, 'Comment not found')

        if (comment.user._id.toString() !== user)
            throw new HttpException(
                403,
                'You can only update your own comments'
            )

        return await CommentModel.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        ).exec()
    }

    public async getCommentById(commentId: string) {
        const comment = await CommentModel.findById(commentId)
            .populate([{ path: 'user', select: author_selected_field }])
            .exec()

        if (!comment) throw new HttpException(404, 'Comment not found')

        return comment
    }
}

export default CommentService
