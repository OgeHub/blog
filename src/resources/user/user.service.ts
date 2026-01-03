import UserModel from '@/resources/user/user.model'
import User, {
    author_selected_field,
    createUser,
    updatePasswordProps,
    userResult,
} from './user.interface'
import { paginationQuery } from '../post/post.interface'
import mongoose from 'mongoose'
import HttpException from '@/utils/exceptions/http.exception'

class UserService {
    public async getUser(id: string): Promise<User | null> {
        try {
            const user = await UserModel.findById(id).select(
                author_selected_field.join(' ')
            )

            if (!user) throw new HttpException(404, 'User not found')

            return user
        } catch (error) {
            throw error
        }
    }

    public async getAllUsers(pagination: paginationQuery): Promise<userResult> {
        try {
            const { limit, cursor } = pagination

            const filter: Record<string, any> = {}
            if (cursor)
                filter._id = { $lt: new mongoose.Types.ObjectId(cursor) }

            const users = await UserModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(limit)
                .select(author_selected_field.join(' '))
                .exec()

            return {
                users,
                cursor:
                    users.length > 0
                        ? users[users.length - 1]._id.toString()
                        : null,
                hasMore: users.length >= limit,
            }
        } catch (error) {
            throw Error('Users not found')
        }
    }

    public async editUser(
        userID: string,
        data: Partial<createUser>
    ): Promise<User | null> {
        try {
            const user = await UserModel.findByIdAndUpdate(userID, data, {
                new: true,
                runValidators: true,
            }).select(author_selected_field.join(' '))

            return user
        } catch (error) {
            throw error
        }
    }

    // Update password
    public async updateUserPassword(
        user: User,
        data: updatePasswordProps
    ): Promise<void> {
        try {
            const { oldPassword, newPassword } = data

            if (await user.isValidPassword(oldPassword)) {
                user.password = newPassword
                await user.save()
            } else {
                throw new HttpException(400, 'Invalid Password')
            }
        } catch (error) {
            throw error
        }
    }
}

export default UserService
