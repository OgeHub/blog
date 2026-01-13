import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from '@/resources/user/user.validation'
import UserService from '@/resources/user/user.service'
import authenticated from '@/middleware/authenticated.middleware'
import { upload } from '@/config/cloudinary'

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private userService = new UserService()

    constructor() {
        this.initializeRouter()
    }

    /** Initialize all user endpoints */
    private initializeRouter(): void {
        this.router.use(authenticated)

        this.router.get(`${this.path}/me`, this.getUserProfile)

        this.router.patch(
            `${this.path}/me`,
            validationMiddleware(validate.edit),
            this.editUserProfile
        )

        this.router.patch(
            `${this.path}/update-password`,
            validationMiddleware(validate.updatePassword),
            this.updateUserPassword
        )

        this.router.get(`${this.path}/:id`, this.getUser)

        this.router.get(`${this.path}`, this.getUsers)

        this.router.patch(
            `${this.path}/me/avatar`,
            authenticated,
            upload.single('file'),
            this.updateUserAvatar
        )

        this.router.delete(
            `${this.path}/me/avatar`,
            authenticated,
            this.removeUserAvatar
        )
    }

    /** User Controllers */

    /**Get a user profile */
    private getUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.userService.getUser(req.user.id)

            return res.status(200).json({
                status: 'success',
                message: 'User profile retrieved successfully',
                data: user,
            })
        } catch (error: any) {
            console.error(`[GetUserProfile]: ${error}`)
            next(error)
        }
    }

    /**Edit user details */
    private editUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userID = req.user.id

            const user = await this.userService.editUser(userID, req.body)

            return res.status(200).json({
                status: 'success',
                message: 'User details edited successfully',
                data: user,
            })
        } catch (error: any) {
            console.error(`[EditUserProfile]: ${error}`)
            next(error)
        }
    }

    /**Edit user password */
    private updateUserPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.updateUserPassword(req.user, req.body)

            return res.status(200).json({
                status: 'success',
                message: 'User password updated successfully',
            })
        } catch (error: any) {
            console.error(`[UpdateUserPassword]: ${error}`)
            next(error)
        }
    }

    /**Get a user details */
    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id

            const user = await this.userService.getUser(id)

            return res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: user,
            })
        } catch (error: any) {
            console.error(`[GetUser]: ${error}`)
            next(error)
        }
    }

    /**Get all users */
    private getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { limit = 20, cursor } = req.query

            const users = await this.userService.getAllUsers({
                limit: limit as number,
                cursor: cursor as string,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Users retrieved successfully',
                data: users,
            })
        } catch (error: any) {
            console.error(`[GetUsers]: ${error}`)
            next(error)
        }
    }

    // update avatar
    private updateUserAvatar = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const file = req.file as any

            const updatedUser = await this.userService.updateUserAvatar(
                req.user,
                { url: file.path, publicId: file.filename }
            )

            return res.status(200).json({
                status: 'success',
                message: 'Avatar updated successfully',
                data: updatedUser,
            })
        } catch (error: any) {
            next(error)
        }
    }

    // remove avatar
    private removeUserAvatar = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.userService.removeUserAvatar(req.user)

            return res.status(200).json({
                status: 'success',
                message: 'Avatar removed successfully',
            })
        } catch (error: any) {
            next(error)
        }
    }
}

export default UserController
