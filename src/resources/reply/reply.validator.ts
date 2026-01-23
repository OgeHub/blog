import Joi from 'joi'

/** Validates create reply data */
const create = Joi.object({
    comment: Joi.string().required(),
    content: Joi.string().required(),
})

/** Validates update reply data */
const update = Joi.object({
    content: Joi.string().required(),
})

export default { create, update }
