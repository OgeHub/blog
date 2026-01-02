import Joi, { optional } from 'joi'
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

/** Validates user login with email data */
const loginWithEmail = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

/** Validates user login with username data */
const loginWithUsername = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

/** Validates edit user data */
const edit = Joi.object({
    username: Joi.string(),
    name: Joi.string().max(30),
})

export default {
    register,
    verifyEmail,
    loginWithEmail,
    loginWithUsername,
    edit,
}
