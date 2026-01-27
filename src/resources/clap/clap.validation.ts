import Joi from 'joi'
import { TargetType } from './clap.interface'

const add = Joi.object({
    target: Joi.string().required(),
    targetType: Joi.string()
        .valid(...Object.values(TargetType))
        .required(),
})

export default { add }
