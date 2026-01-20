import User from '../user/user.interface'

export interface Reply extends Document {
    comment: Comment
    user: User
    content: string
}
