import PostModel from '@/resources/post/post.model'
import {
    Post,
    paginationQuery,
    postResult,
} from '@/resources/post/post.interface'
import mongoose from 'mongoose'
import { author_selected_field } from '../user/user.interface'
import HttpException from '@/utils/exceptions/http.exception'

class PostService {
    /**Create a post */
    public async create(
        title: string,
        body: string,
        user: string
    ): Promise<Post> {
        try {
            const post = await PostModel.create({
                title,
                body,
                user,
            })

            return post
        } catch (error) {
            throw new Error('Unable to create post')
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
            throw Error('Unable to retrieve post')
        }
    }

    /**Get all posts */
    public async getAllPosts(pagination: paginationQuery): Promise<postResult> {
        try {
            const { limit, cursor } = pagination

            const filter: Record<string, any> = {}
            if (cursor)
                filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }

            const posts = await PostModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate([{ path: 'user', select: author_selected_field }])
                .exec()

            return {
                posts,
                cursor: posts.length > 0 ? posts[posts.length - 1]._id : null,
                hasMore: posts.length >= limit,
            }
        } catch (error) {
            throw Error('Unable to retrieve posts')
        }
    }

    /**Delete post */
    public async deletePost(id: string, userID: string): Promise<void> {
        try {
            const post = await this.getPost(id)

            if (post?.user._id !== userID)
                throw new HttpException(
                    403,
                    'You can only delete post you authored'
                )

            await PostModel.findByIdAndDelete(id)
        } catch (error) {
            throw Error('Unable to delete post')
        }
    }

    /**Edit post */
    public async editPost(
        id: string,
        user: string,
        data: Partial<Post>
    ): Promise<any> {
        try {
            const post = await this.getPost(id)

            if (post?.user._id !== user)
                throw new HttpException(
                    403,
                    'You can only edit post you authored'
                )

            const updatedPost = await PostModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            return updatedPost
        } catch (error) {
            throw Error('Unable to edit post')
        }
    }
}

export default PostService
