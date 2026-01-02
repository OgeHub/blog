import { Document } from 'mongoose'

export enum RoleEnum {
    Guest = 'Guest',
    Member = 'Member',
}

export interface createUser {
    username: string
    firstName: string
    lastName: string
    password: string
    email: string
    avatar?: string
    bio?: string
}

interface User extends Document {
    _id: string
    username: string
    firstName: string
    lastName: string
    avatar: string
    bio: string
    password: string
    email: string
    role: RoleEnum
    isEmailVerified: boolean
    emailVerificationToken: string | undefined
    verificationTokenExpires: Date | undefined
    passwordResetToken: string | undefined
    passwordTokenExpires: Date | undefined

    isValidPassword(password: string): Promise<Error | Boolean>
    getEmailVerificationToken(): string
    getPasswordResetToken(): string
}

export const author_selected_field = [
    'username',
    'firstName',
    'lastName',
    'email',
    'role',
    'avatar',
    'bio',
]

export default User
