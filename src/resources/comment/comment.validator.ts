import Joi from 'joi'

/** Validates create comment data */
const create = Joi.object({
    post: Joi.string().required(),
    content: Joi.string().required(),
})

/** validate update comment data */
const update = Joi.object({
    content: Joi.string().required(),
})

export default { create, update }
