import Controller from '@/utils/interfaces/controller.interface'
import { NextFunction, Request, Response, Router } from 'express'
import CommentService from './comment.service'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from './comment.validator'

class CommentController implements Controller {
    public path = '/comments'
    public router = Router()
    private commentService = new CommentService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.addComment
        )

        this.router.get(`${this.path}/post/:id`, this.getCommentsByPostId)

        this.router.patch(
            `${this.path}/:commentId`,
            validationMiddleware(validate.update),
            this.updateComment
        )

        this.router.delete(`${this.path}/:commentId`, this.deleteComment)
    }

    private addComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const comment = await this.commentService.addCommentToPost({
                ...req.body,
                user: req.user.id,
            })

            return res.status(201).json({
                status: 'success',
                message: 'Comment added successfully',
                data: comment,
            })
        } catch (error) {
            next(error)
        }
    }

    private getCommentsByPostId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { limit = 10, cursor } = req.query

            const result = await this.commentService.getCommentsByPostId(
                req.params.id,
                {
                    limit: limit as number,
                    cursor: cursor as string,
                }
            )

            return res.status(200).json({
                status: 'success',
                message: 'Comments fetched successfully',
                data: result,
            })
        } catch (error) {
            next(error)
        }
    }

    private updateComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { commentId } = req.params
            const { content } = req.body

            const updatedComment = await this.commentService.updateComment({
                commentId,
                user: req.user.id,
                content,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Comment updated successfully',
                data: updatedComment,
            })
        } catch (error) {
            next(error)
        }
    }

    private deleteComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { commentId } = req.params

            await this.commentService.deleteComment({
                commentId,
                user: req.user.id,
            })

            return res.status(200).json({
                status: 'success',
                message: 'Comment deleted successfully',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default CommentController
