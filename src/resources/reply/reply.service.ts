import HttpException from '@/utils/exceptions/http.exception'
import { createCommentProps } from '../comment/comment.interface'
import { Reply, replyResult, updateReplyProps } from './reply.interface'
import { ReplyModel } from './reply.model'
import { paginationQuery } from '../post/post.interface'
import mongoose from 'mongoose'
import { author_selected_field } from '../user/user.interface'

class ReplyService {
    public async addReply(payload: createCommentProps): Promise<Reply> {
        return await ReplyModel.create(payload)
    }

    public async updateReply(payload: updateReplyProps): Promise<Reply | null> {
        const { replyId, user, content } = payload

        const reply = await ReplyModel.findById(replyId).exec()

        if (!reply) {
            throw new HttpException(404, 'Reply not found')
        }
        if (reply.user.toString() !== user) {
            throw new HttpException(403, 'You can only update your own replies')
        }

        reply.content = content
        await reply.save()

        return reply
    }

    public async deleteReply(replyId: string, userId: string): Promise<void> {
        const reply = await ReplyModel.findById(replyId).exec()

        if (!reply) {
            throw new HttpException(404, 'Reply not found')
        }

        if (reply.user.toString() !== userId) {
            throw new HttpException(403, 'You can only delete your own replies')
        }

        await ReplyModel.findByIdAndDelete(replyId).exec()
    }

    public async getRepliesByCommentId(
        commentId: string,
        pagination: paginationQuery
    ): Promise<replyResult> {
        const { limit, cursor } = pagination

        const filter: Record<string, any> = { comment: commentId }
        if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }

        const replies = await ReplyModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate([{ path: 'user', select: author_selected_field }])
            .exec()

        return {
            replies,
            cursor:
                replies.length > 0
                    ? replies[replies.length - 1]._id.toString()
                    : null,
            hasMore: replies.length >= limit,
        }
    }

    public async getReplyById(replyId: string): Promise<Reply | null> {
        const reply = await ReplyModel.findById(replyId)
            .populate([{ path: 'user', select: author_selected_field }])
            .exec()

        return reply
    }
}

export default ReplyService
