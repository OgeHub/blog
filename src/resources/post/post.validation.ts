import Joi from 'joi'

/** Validates create post data */
const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    postAvatar: Joi.object({ url: Joi.string(), publicId: Joi.string() }),
})

/**Validates edit post data*/
const edit = Joi.object({
    title: Joi.string().optional(),
    body: Joi.string().optional(),
    postAvatar: Joi.object({ url: Joi.string(), publicId: Joi.string() }),
})
export default { create, edit }
