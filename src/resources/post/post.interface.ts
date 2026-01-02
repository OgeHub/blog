import { Document } from 'mongoose'
import User from '../user/user.interface'

export interface Post extends Document {
    user: User
    title: string
    body: string
}

export interface Comment extends Document {
    post: string
    content: string
}

export interface postResult {
    posts: Post[] | []
    cursor: string
    hasMore: boolean
}

export interface paginationQuery {
    limit: number
    cursor?: string
}
