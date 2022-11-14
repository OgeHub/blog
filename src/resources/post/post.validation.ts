import Joi from 'joi';

/** Validates create post data */
const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

/**Validates edit post data*/
const edit = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
});
export default { create, edit };
