import Joi from 'joi'

/** Validates edit user data */
const edit = Joi.object({
    username: Joi.string().optional(),
    firstName: Joi.string().min(3).max(30).optional(),
    lastName: Joi.string().min(3).max(30).optional(),
    bio: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
})
    .min(1)
    .strict()

/** Validates update password */
const updatePassword = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
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
    edit,
    updatePassword,
}
