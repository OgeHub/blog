import { Router, Request, Response, NextFunction } from 'express'
import Controller from '@/utils/interfaces/controller.interface'
import authenticated from '@/middleware/authenticated.middleware'
import { upload } from '@/config/cloudinary'

class UploadController implements Controller {
    public path = '/uploads'
    public router = Router()

    constructor() {
        this.initializeRoutes()
    }

    /** Initialize all endpoints */
    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/avatar`,
            authenticated,
            upload.single('file'),
            this.uploadFile
        )
    }

    private uploadFile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const file = req.file as any

            return res.status(200).json({
                status: 'success',
                message: 'File uploaded successfully',
                data: {
                    url: file.path,
                    publicId: file.filename,
                },
            })
        } catch (error: any) {
            next(error)
        }
    }
}

export default UploadController
