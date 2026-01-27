import HttpException from '@/utils/exceptions/http.exception'
import { createCommentProps } from '../comment/comment.interface'
import { Reply, replyResult, updateReplyProps } from './reply.interface'
import { ReplyModel } from './reply.model'
import { paginationQuery } from '../post/post.interface'
import mongoose, { PipelineStage } from 'mongoose'
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
    pagination: paginationQuery,
    viewer: string
  ): Promise<replyResult> {
    const { limit, cursor } = pagination

    const filter: Record<string, any> = {
      comment: new mongoose.Types.ObjectId(commentId),
    }
    if (cursor) filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }

    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $sort: { _id: -1 } },
      { $limit: Number(limit) },

      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                username: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                avatar: 1,
                bio: 1,
                city: 1,
                country: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Claps count
      {
        $lookup: {
          from: 'claps',
          let: { replyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$target', '$$replyId'] },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: '$count' },
              },
            },
          ],
          as: 'clapsCountTemp',
        },
      },
      {
        $addFields: {
          clapsCount: {
            $ifNull: [{ $arrayElemAt: ['$clapsCountTemp.count', 0] }, 0],
          },
        },
      },

      // Clapped by me
      {
        $lookup: {
          from: 'claps',
          let: {
            postId: '$_id',
            viewerId: new mongoose.Types.ObjectId(viewer),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$target', '$$postId'] },
                    { $eq: ['$user', '$$viewerId'] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'isClappedByMeTemp',
        },
      },
      {
        $addFields: {
          isClappedByMe: { $gt: [{ $size: '$isClappedByMeTemp' }, 0] },
          clapId: { $first: '$isClappedByMeTemp._id' },
        },
      },

      {
        $project: {
          clapsCountTemp: 0,
          isClappedByMeTemp: 0,
          __v: 0,
        },
      },
    ]

    const replies = await ReplyModel.aggregate(pipeline)

    return {
      replies,
      cursor:
        replies.length > 0 ? replies[replies.length - 1]._id.toString() : null,
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
