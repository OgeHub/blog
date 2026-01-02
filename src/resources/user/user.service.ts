import UserModel from '@/resources/user/user.model'
import { author_selected_field, userResult } from './user.interface'
import { paginationQuery } from '../post/post.interface'
import mongoose from 'mongoose'

class UserService {
    public async getUser(id: string): Promise<object | null> {
        try {
            const user = await UserModel.findById(id).select(
                author_selected_field.join(' ')
            )

            return user
        } catch (error) {
            throw Error('User not found')
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

    public async editUser(userID: string, data: object): Promise<any> {
        try {
            const user = await UserModel.findByIdAndUpdate(userID, data, {
                new: true,
                runValidators: true,
            }).select(author_selected_field.join(' '))

            return user
        } catch (error) {
            throw Error('Unable to edit user details')
        }
    }
}

export default UserService
