import Joi from 'joi'
import { postStatus } from './post.interface'

/** Validates create post data */
const create = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  postAvatar: Joi.object({ url: Joi.string(), publicId: Joi.string() }),
  status: Joi.string()
    .valid(...Object.values(postStatus))
    .optional(),
})

/**Validates edit post data*/
const edit = Joi.object({
  title: Joi.string().optional(),
  body: Joi.string().optional(),
  postAvatar: Joi.object({ url: Joi.string(), publicId: Joi.string() }),
  status: Joi.string()
    .valid(...Object.values(postStatus))
    .optional(),
})
export default { create, edit }
