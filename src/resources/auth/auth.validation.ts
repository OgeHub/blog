import Joi from 'joi'

/** Validates register user data */
const register = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/\d/, 'number')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special')
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.name.uppercase':
                'Password must contain at least one uppercase letter',
            'string.pattern.name.lowercase':
                'Password must contain at least one lowercase letter',
            'string.pattern.name.number':
                'Password must contain at least one number',
            'string.pattern.name.special':
                'Password must contain at least one special character',
            'any.required': 'Password is required',
        }),
    avatar: Joi.string().optional(),
    bio: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
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

/** Validates user reset password data */
const resetPassword = Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/\d/, 'number')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special')
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.name.uppercase':
                'Password must contain at least one uppercase letter',
            'string.pattern.name.lowercase':
                'Password must contain at least one lowercase letter',
            'string.pattern.name.number':
                'Password must contain at least one number',
            'string.pattern.name.special':
                'Password must contain at least one special character',
            'any.required': 'Password is required',
        }),
})

export default {
    register,
    verifyEmail,
    login,
    checkUsername,
    resetPassword,
    resendEmail,
}
