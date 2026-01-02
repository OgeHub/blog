import Joi from 'joi'

/** Validates edit user data */
const edit = Joi.object({
    username: Joi.string(),
    name: Joi.string().max(30),
})

export default {
    edit,
}
