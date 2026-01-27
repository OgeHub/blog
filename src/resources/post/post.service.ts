import PostModel from '@/resources/post/post.model'
import {
  Post,
  createPostProps,
  paginationQuery,
  postResult,
} from '@/resources/post/post.interface'
import mongoose, { PipelineStage } from 'mongoose'
import { author_selected_field } from '../user/user.interface'
import HttpException from '@/utils/exceptions/http.exception'
import UploadService from '../upload/upload.service'
import { CommentModel } from '../comment/comment.model'
import { ReplyModel } from '../reply/reply.model'

class PostService {
  private uploadService = new UploadService()
  /**Create a post */
  public async create(payload: createPostProps): Promise<Post> {
    try {
      if (payload?.postAvatar) {
        await this.uploadService.updateFileTag(
          payload.postAvatar.publicId,
          'avatar'
        )
      }
      const post = await PostModel.create(payload)

      return post
    } catch (error) {
      throw error
    }
  }

  /**Get details of a post */
  public async getPost(id: string): Promise<Post | null> {
    try {
      const post = await PostModel.findById(id)
        .populate([{ path: 'user', select: author_selected_field }])
        .exec()

      if (!post) throw new HttpException(404, 'Post not found')

      return post
    } catch (error) {
      throw error
    }
  }

  /**Get all posts */
  public async getAllPosts(
    pagination: paginationQuery,
    viewer: string
  ): Promise<postResult> {
    try {
      const { limit, cursor } = pagination

      const filter: Record<string, any> = {}
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

        // Count comments
        {
          $lookup: {
            from: 'comments',
            let: { postId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$post', '$$postId'] },
                },
              },
              { $count: 'count' },
            ],
            as: 'commentsCountTemp',
          },
        },
        {
          $addFields: {
            commentsCount: {
              $ifNull: [{ $arrayElemAt: ['$commentsCountTemp.count', 0] }, 0],
            },
          },
        },

        // Count claps
        {
          $lookup: {
            from: 'claps',
            let: {
              postId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$target', '$$postId'] },
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
            commentsCountTemp: 0,
            clapsCountTemp: 0,
            isClappedByMeTemp: 0,
            __v: 0,
          },
        },
      ]

      const posts = await PostModel.aggregate(pipeline)

      return {
        posts,
        cursor:
          posts.length > 0 ? posts[posts.length - 1]._id.toString() : null,
        hasMore: posts.length >= limit,
      }
    } catch (error) {
      throw Error('Unable to retrieve posts')
    }
  }

  /**Delete post */
  public async deletePost(id: string, userID: string): Promise<void> {
    const post = await this.getPost(id)

    if (post?.user.id !== userID)
      throw new HttpException(403, 'You can only delete post you authored')

    // start a session for transaction
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      // delete associated comments and replies
      const comments = await CommentModel.find({ post: id }).exec()
      const commentIds = comments.map((comment) => comment._id)

      await ReplyModel.deleteMany({ comment: { $in: commentIds } })
        .session(session)
        .exec()
      await CommentModel.deleteMany({ post: id }).session(session).exec()

      // delete the post
      await PostModel.findByIdAndDelete(id).session(session).exec()

      await session.commitTransaction()
    } catch (error) {
      console.error('Error deleting post, comments, and replies:', error)
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }

    // delete media associated with the post if any
    if (post?.postAvatar) {
      await this.uploadService.deleteFile(post?.postAvatar?.publicId)
    }
  }

  /**Edit post */
  public async editPost(
    id: string,
    user: string,
    data: Partial<createPostProps>
  ): Promise<any> {
    try {
      const post = await this.getPost(id)

      if (post?.user.id !== user)
        throw new HttpException(403, 'You can only edit post you authored')

      const updatedPost = await PostModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })

      return updatedPost
    } catch (error) {
      throw error
    }
  }
}

export default PostService
