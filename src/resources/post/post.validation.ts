import Joi from 'joi';

/** Validates create post data */
const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

export default { create };
