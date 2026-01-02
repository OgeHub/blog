import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import HttpException from '@/utils/exceptions/http.exception'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from '@/resources/user/user.validation'
import UserService from '@/resources/user/user.service'
import authenticated from '@/middleware/authenticated.middleware'

class UserController implements Controller {
    public path = '/users'
    public router = Router()
    private UserService = new UserService()

    constructor() {
        this.initializeRouter()
    }

    /** Initialize all user endpoints */
    private initializeRouter(): void {
        this.router.get(`${this.path}/:id`, authenticated, this.getUser)

        this.router.patch(
            `${this.path}`,
            authenticated,
            validationMiddleware(validate.edit),
            this.editUser
        )

        this.router.get(`${this.path}`, authenticated, this.getUsers)
    }

    /** User Controllers */

    /**Get a user details */
    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id
            const user = await this.UserService.getUser(id)

            res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: user,
            })
        } catch (error: any) {
            next(new HttpException(404, error.message))
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

            const users = await this.UserService.getAllUsers({
                limit: limit as number,
                cursor: cursor as string,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Users retrieved successfully',
                data: users,
            })
        } catch (error: any) {
            next(new HttpException(404, error.message))
        }
    }

    /**Edit user details */
    private editUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userID = req.user._id
            const { name, username } = req.body
            const user = await this.UserService.editUser(userID, {
                name,
                username,
            })

            res.status(200).json({
                status: 'success',
                message: 'User details edited successfully',
                data: user,
            })
        } catch (error: any) {
            next(new HttpException(404, error.message))
        }
    }
}

export default UserController
