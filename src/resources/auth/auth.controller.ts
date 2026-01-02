import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from '@/resources/auth/auth.validation'
import AuthService from './auth.service'

class AuthController implements Controller {
    public path = '/auth'
    public router = Router()
    private AuthService = new AuthService()

    constructor() {
        this.initializeRouter()
    }

    /** Initialize all user endpoints */
    private initializeRouter(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        )

        this.router.patch(
            `${this.path}/verify-email`,
            validationMiddleware(validate.verifyEmail),
            this.verifyEmail
        )

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        )

        this.router.post(
            `${this.path}/check-username`,
            validationMiddleware(validate.checkUsername),
            this.checkUsername
        )

        this.router.post(
            `${this.path}/forgot-password`,
            validationMiddleware(validate.resendEmail),
            this.forgotPassword
        )

        this.router.patch(
            `${this.path}/reset-password`,
            validationMiddleware(validate.resetPassword),
            this.resetPassword
        )

        this.router.post(
            `${this.path}/resend-email-verification`,
            validationMiddleware(validate.resendEmail),
            this.resendEmailVerificationToken
        )
    }

    /** Auth Controllers */

    /**Check username */
    private checkUsername = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const message = await this.AuthService.isUsernameAvailable(
                req.body.username
            )

            return res.status(200).json({
                status: 'success',
                message,
            })
        } catch (error: any) {
            console.error(`[CheckUsername]: ${error}`)
            next(error)
        }
    }

    /**Register user */
    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.AuthService.register(req.body)

            return res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
            })
        } catch (error: any) {
            console.error(`[Register]: ${error}`)
            next(error)
        }
    }

    /**Verify Email */
    private verifyEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const token = req.body.token

            const message = await this.AuthService.verifyEmail(token as string)

            return res.status(200).json({
                status: 'success',
                message,
            })
        } catch (error: any) {
            console.error(`[VerifyEmail]: ${error}`)
            next(error)
        }
    }

    /**Login */
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const accessToken = await this.AuthService.login(req.body)

            return res.status(200).json({
                status: 'success',
                message: 'Login successfully',
                data: { accessToken },
            })
        } catch (error: any) {
            console.error(`[Login]: ${error}`)
            next(error)
        }
    }

    /**Forgot password */
    private forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.AuthService.forgotPassword(req.body.email)

            return res.status(200).json({
                status: 'success',
                message: 'Password reset link sent successfully',
            })
        } catch (error: any) {
            console.error(`[Login]: ${error}`)
            next(error)
        }
    }

    /**Reset Password */
    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const message = await this.AuthService.resetPassword(req.body)

            return res.status(200).json({
                status: 'success',
                message,
            })
        } catch (error: any) {
            next(error)
        }
    }

    /**Resend email verification token */
    private resendEmailVerificationToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.AuthService.resendEmailVerification(req.body.email)

            return res.status(200).json({
                status: 'success',
                message: 'Email verification link resent successfully',
            })
        } catch (error: any) {
            next(error)
        }
    }
}

export default AuthController
