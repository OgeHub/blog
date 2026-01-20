import { Post } from '../post/post.interface'
import { Reply } from '../reply/reply.interface'
import User from '../user/user.interface'

export interface Clap extends Document {
    target: Post | Comment | Reply
    targetType: TargetType
    user: User
    count: number
}

export enum TargetType {
    Post = 'Post',
    Comment = 'Comment',
    Reply = 'Reply',
}
