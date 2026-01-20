import { Document } from 'mongoose'
import User from '../user/user.interface'

export interface createPostProps {
    user: string
    title: string
    body: string
    postAvatar?: { url: string; publicId: string }
}

export interface Post extends Document {
    user: User
    title: string
    body: string
    postAvatar: { url: string; publicId: string }
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
