import Joi from 'joi'

/** Validates register user data */
const register = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().optional(),
    bio: Joi.string().optional(),
})

const verifyEmail = Joi.object({
    token: Joi.string().required(),
})

const resendEmail = Joi.object({
    email: Joi.string().email().required(),
})

const checkUsername = Joi.object({
    username: Joi.string().required(),
})

/** Validates user login data */
const login = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
})

/** Validates user login data */
const resetPassword = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
})

export default {
    register,
    verifyEmail,
    login,
    checkUsername,
    resetPassword,
    resendEmail,
}
