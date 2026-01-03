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
    city?: string
    country?: string
}

export interface updatePasswordProps {
    oldPassword: string
    newPassword: string
}

interface User extends Document {
    _id: string
    id: string
    username: string
    firstName: string
    lastName: string
    avatar: string
    bio: string
    password: string
    email: string
    city: string
    country: string
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
    'city',
    'country',
]

export interface userResult {
    users: User[] | []
    cursor: string | null
    hasMore: boolean
}

export default User
