import Controller from '@/utils/interfaces/controller.interface'
import { Router, Request, Response, NextFunction } from 'express'
import ClapService from './clap.service'
import authenticated from '@/middleware/authenticated.middleware'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from './clap.validation'

class ClapController implements Controller {
    public path = '/claps'
    public router = Router()
    private clapService = new ClapService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.use(authenticated)

        this.router.post(
            `${this.path}/add`,
            validationMiddleware(validate.add),
            this.addClap
        )
        this.router.delete(`${this.path}/:id`, this.removeClap)
    }

    private addClap = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const clap = await this.clapService.addClap({
                ...req.body,
                user: req.user.id,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Clap added successfully',
                data: clap,
            })
        } catch (error: any) {
            next(error)
        }
    }

    private removeClap = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.clapService.removeClaps(req.params.id, req.user.id)

            return res.status(200).json({
                status: 'success',
                message: 'Clap removed successfully',
            })
        } catch (error: any) {
            next(error)
        }
    }
}

export default ClapController
