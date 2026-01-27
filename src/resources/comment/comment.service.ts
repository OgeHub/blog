import mongoose, { PipelineStage } from 'mongoose'
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
    pagination: paginationQuery,
    viewer: string
  ) {
    const { limit, cursor } = pagination

    const filter: Record<string, any> = {
      post: new mongoose.Types.ObjectId(postId),
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

      // Count replies
      {
        $lookup: {
          from: 'replies',
          let: { commentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$comment', '$$commentId'] },
              },
            },
            { $count: 'count' },
          ],
          as: 'repliesCountTemp',
        },
      },
      {
        $addFields: {
          repliesCount: {
            $ifNull: [{ $arrayElemAt: ['$repliesCountTemp.count', 0] }, 0],
          },
        },
      },

      // Count claps
      {
        $lookup: {
          from: 'claps',
          let: { commentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$target', '$$commentId'] },
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
          repliesCountTemp: 0,
          clapsCountTemp: 0,
          isClappedByMeTemp: 0,
          __v: 0,
        },
      },
    ]

    const comments = await CommentModel.aggregate(pipeline)

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
      throw new HttpException(403, 'You can only delete your own comments')

    // start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // Delete associated replies
      await ReplyModel.deleteMany({ comment: commentId })
        .session(session)
        .exec()

      await CommentModel.findByIdAndDelete(commentId).session(session).exec()

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
      throw new HttpException(403, 'You can only update your own comments')

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
