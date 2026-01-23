import User from '../user/user.interface'

export interface Reply extends Document {
    id: string
    _id: string
    comment: Comment
    user: User
    content: string
}

export interface createReplyProps {
    comment: string
    user: string
    content: string
}

export interface updateReplyProps {
    replyId: string
    user: string
    content: string
}

export interface replyResult {
    replies: Reply[] | []
    cursor: string | null
    hasMore: boolean
}
