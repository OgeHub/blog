import { Request, Response, NextFunction } from 'express'
import HttpException from '@/utils/exceptions/http.exception'

export const errorMiddleware = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response<HttpException> => {
    // Bad JSON request body
    if (error.type === 'entity.parse.failed') {
        return res.status(400).send({
            status: 'error',
            message: 'Bad JSON request body',
        })
    }

    // Mongoose duplicate key value
    if (error.code === 11000) {
        const keyVal = Object.keys(error.keyValue)[0]
        return res.status(400).send({
            status: 'error',
            statusCode: 400,
            message: `${keyVal} already exist`,
        })
    }

    // Mongoose bad ObjectID
    if (error.name === 'CastError') {
        return res.status(400).send({
            status: 'error',
            statusCode: 400,
            message: `Invalid resource ID`,
        })
    }

    // Log the errors we didn't handle
    console.error(`[ErrorHandler]:${error.message}`)

    const statusCode =
        typeof error.statusCode === 'number' && error.statusCode !== 200
            ? error.statusCode
            : 500

    const message =
        statusCode >= 400 && statusCode < 500
            ? error.message
            : error.message || 'Something went wrong!'

    return res.status(statusCode).send({
        status: 'error',
        message,
        ...(error.errors && { errors: error.errors }),
    })
}

// Handles request to routes that are not available on the server
export const unhandledRoutes = (
    req: Request,
    res: Response
): Response<HttpException> => {
    return res.status(404).send({
        status: 'error',
        statusCode: 404,
        message: `${req.method} request to: ${req.originalUrl} not available on this server!`,
    })
}
