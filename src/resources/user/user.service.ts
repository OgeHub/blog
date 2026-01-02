import UserModel from '@/resources/user/user.model'
import token from '@/utils/token'
import { sendEmailVerificationLink } from '@/utils/shared/email'
import crypto from 'crypto'
import { author_selected_field, createUser } from './user.interface'
import { paginationQuery } from '../post/post.interface'
import HttpException from '@/utils/exceptions/http.exception'

class UserService {
    public async register(payload: createUser): Promise<void> {
        try {
            /**Check if user exist */
            const user = await UserModel.findOne({ email: payload.email })
            if (user) {
                throw Error('User already exist, login instead')
            }

            const newUser = new UserModel(payload)

            /**Generate email verification token*/
            const token = newUser.getEmailVerificationToken()

            await newUser.save()

            // send email verification link email
            await sendEmailVerificationLink({
                recipient: newUser.email,
                firstName: newUser.firstName,
                token,
            })
        } catch (error: any) {
            console.error(`Error registering user: ${error?.message}`)
            throw Error(error)
        }
    }

    public async verifyEmail(token: string): Promise<string | Error> {
        try {
            /**Hash token*/
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex')

            /**Find user with the token */
            const user = await UserModel.findOne({
                emailVerificationToken: hashedToken,
                verificationTokenExpires: { $gt: Date.now() },
            })
            if (!user) {
                throw new HttpException(400, 'Invalid or expired token')
            }

            user.isEmailVerified = true
            user.emailVerificationToken = undefined
            user.verificationTokenExpires = undefined

            await user.save()

            return 'Email verified successfully'
        } catch (error: any) {
            throw Error(error.message)
        }
    }

    public async loginWithEmail(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            // Find User
            const user = await UserModel.findOne({ email })
            if (!user) throw Error('User not found')

            /**Check if email is verified*/
            if (user.isEmailVerified) {
                /**Check if password is correct*/
                if (await user.isValidPassword(password)) {
                    return token.createToken(user)
                } else {
                    throw Error('Invalid credentials')
                }
            } else {
                throw Error('Verify email to login')
            }
        } catch (error) {
            throw Error('Unable to login')
        }
    }

    public async loginWithUsername(
        username: string,
        password: string
    ): Promise<string | Error> {
        try {
            // Find user
            const user = await UserModel.findOne({ username })
            if (!user) throw Error('User not found')

            /**Check if email is verified*/
            if (user.isEmailVerified) {
                /**Check if password is correct*/
                if (await user.isValidPassword(password)) {
                    return token.createToken(user)
                } else {
                    throw Error('Invalid credentials')
                }
            } else {
                throw Error('Verify email to login')
            }
        } catch (error) {
            console.log(error)
            throw Error('Unable to login')
        }
    }

    public async forgotPassword(email: string): Promise<string | Error> {
        try {
            /**Find user */
            const user = await UserModel.findOne({ email })
            if (!user) {
                throw Error('There  is no user with this email')
            }

            /**Generate password reset token */
            const token = user.getPasswordResetToken()

            await user.save()

            return token
        } catch (error) {
            throw Error('Unable to send password reset link')
        }
    }

    public async resetPassword(
        token: string,
        password: string
    ): Promise<string | Error> {
        try {
            /**Hash token */
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex')

            /**Find user */
            const user = await UserModel.findOne({
                passwordResetToken: hashedToken,
                passwordTokenExpires: { $gt: Date.now() },
            })
            if (!user) {
                throw Error('Invalid or expired token')
            }

            /**Update password */
            user.password = password
            user.passwordResetToken = undefined
            user.passwordTokenExpires = undefined
            await user.save()

            return 'Password updated successfully'
        } catch (error) {
            throw Error('Unable to reset password')
        }
    }

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

    public async getAllUsers(pagination: paginationQuery): Promise<any> {
        try {
            const users = await UserModel.find({})
                .sort({
                    createdAt: -1,
                })
                .select(author_selected_field.join(' '))

            return users
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
