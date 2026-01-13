import UserModel from '@/resources/user/user.model'
import token from '@/utils/token'
import {
    sendEmailVerificationLink,
    sendPasswordResetLink,
} from '@/utils/shared/email'
import crypto from 'crypto'
import HttpException from '@/utils/exceptions/http.exception'
import { createUser } from '../user/user.interface'
import { loginProps, resetPasswordProps } from './auth.interface'
import UploadService from '../upload/upload.service'

class AuthService {
    private uploadService = new UploadService()

    public async isUsernameAvailable(username: string): Promise<string> {
        try {
            /**Find user with username */
            const user = await UserModel.findOne({
                username: username.toLowerCase(),
            })
            if (user) {
                throw new HttpException(400, 'Username is not available')
            }

            return 'Username is available'
        } catch (error: any) {
            throw error
        }
    }

    public async register(payload: createUser): Promise<void> {
        try {
            /**Check if user exist */
            const user = await UserModel.findOne({ email: payload.email })
            if (user) {
                throw new HttpException(
                    400,
                    'User already exist, login instead'
                )
            }

            if (payload.avatar) {
                await this.uploadService.updateFileTag(
                    payload.avatar.publicId,
                    'avatar'
                )
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
            throw error
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
            throw error
        }
    }

    public async resendEmailVerification(email: string): Promise<void> {
        try {
            /**Check if user exist */
            const user = await UserModel.findOne({ email })
            if (!user) {
                throw new HttpException(404, 'User not found')
            }

            if (user.isEmailVerified)
                throw new HttpException(400, 'Email already verified')

            /**Generate email verification token*/
            const token = user.getEmailVerificationToken()

            await user.save()

            // send email verification link email
            await sendEmailVerificationLink({
                recipient: user.email,
                firstName: user.firstName,
                token,
            })
        } catch (error: any) {
            throw error
        }
    }

    public async login(payload: loginProps): Promise<string | Error> {
        try {
            const { identifier, password } = payload

            const normalizedIdentifier = identifier.toLowerCase()
            // Find User
            const user = await UserModel.findOne({
                $or: [
                    { email: normalizedIdentifier },
                    { username: normalizedIdentifier },
                ],
            })
            if (!user) throw new HttpException(400, 'Invalid credentials')

            /**Check if email is verified*/
            if (!user.isEmailVerified)
                throw new HttpException(400, 'Verify email to login')

            if (await user.isValidPassword(password)) {
                return token.createToken(user)
            } else {
                throw new HttpException(400, 'Invalid credentials')
            }
        } catch (error) {
            throw error
        }
    }

    public async forgotPassword(email: string): Promise<void> {
        try {
            /**Find user */
            const user = await UserModel.findOne({ email })
            if (!user) {
                throw new HttpException(
                    404,
                    'There  is no user with this email'
                )
            }

            /**Generate password reset token */
            const token = user.getPasswordResetToken()

            await user.save()

            await sendPasswordResetLink({
                recipient: user.email,
                firstName: user.firstName,
                token,
            })
        } catch (error) {
            throw error
        }
    }

    public async resetPassword(
        payload: resetPasswordProps
    ): Promise<string | Error> {
        try {
            const { token, password } = payload
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
                throw new HttpException(400, 'Invalid or expired token')
            }

            /**Update password */
            user.password = password
            user.passwordResetToken = undefined
            user.passwordTokenExpires = undefined
            await user.save()

            return 'Password updated successfully'
        } catch (error) {
            throw error
        }
    }
}

export default AuthService
