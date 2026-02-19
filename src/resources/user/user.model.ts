import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import User, { RoleEnum } from '@/resources/user/user.interface'
import crypto from 'crypto'
import createSchema from '@/utils/shared/createSchema'

export const AvatarSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, _id: false }
)

const UserSchema = createSchema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  avatar: {
    type: AvatarSchema,
  },

  bio: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: RoleEnum.Guest,
    enum: Object.values(RoleEnum),
  },

  city: {
    type: String,
  },

  country: {
    type: String,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  stripeCustomerId: {
    type: String,
  },

  emailVerificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordTokenExpires: Date,
})

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next()

  const hashedPassword = await bcrypt.hash(this.password, 10)
  this.password = hashedPassword

  next()
})

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.getEmailVerificationToken = function (): string {
  /**Generate token */
  const verificationToken = crypto.randomBytes(20).toString('hex')

  /**Hash token  and save it*/
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex')

  /**Set expiration date for token*/
  this.verificationTokenExpires = Date.now() + 10 * 60 * 1000

  return verificationToken
}

UserSchema.methods.getPasswordResetToken = function (): string {
  /**Generate token */
  const resetToken = crypto.randomBytes(20).toString('hex')

  /**Hash token and save it */
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  /**Set expiration date for token */
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}
export default model<User>('User', UserSchema)
