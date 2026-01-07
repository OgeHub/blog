import { Document } from 'mongoose'
import User from '../user/user.interface'

export interface createPostProps {
    user: string
    title: string
    body: string
    postAvatar?: string
}

export interface Post extends Document {
    user: User
    title: string
    body: string
    postAvatar: string
}

export interface Comment extends Document {
    post: Post
    user: User
    content: string
}

export interface Clap extends Document {
    post: string
    user: User
    count: number
}

export interface postResult {
    posts: Post[] | []
    cursor: string | null
    hasMore: boolean
}

export interface paginationQuery {
    limit: number
    cursor?: string
}
