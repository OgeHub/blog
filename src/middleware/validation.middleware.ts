import HttpException from '@/utils/exceptions/http.exception'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import Joi from 'joi'

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: false,
        }

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            )
            req.body = value
            next()
        } catch (err: any) {
            const errors: string[] = []
            err.details.forEach((error: Joi.ValidationError) => {
                errors.push(error.message)
            })

            next(new HttpException(400, 'Validation error', errors))
        }
    }
}

export default validationMiddleware
