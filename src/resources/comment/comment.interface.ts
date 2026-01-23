import { Post } from '../post/post.interface'
import User from '../user/user.interface'

export interface Comment extends Document {
    id: string
    _id: string
    post: Post
    user: User
    content: string
}

export interface createCommentProps {
    postId: string
    user: string
    content: string
}

export interface deleteCommentProps {
    commentId: string
    user: string
}

export interface updateCommentProps {
    commentId: string
    user: string
    content: string
}

export interface commentResult {
    comments: Comment[] | []
    cursor: string | null
    hasMore: boolean
}
