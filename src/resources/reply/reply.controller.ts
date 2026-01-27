import Controller from '@/utils/interfaces/controller.interface'
import { Request, Response, NextFunction, Router } from 'express'
import ReplyService from './reply.service'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from './reply.validator'
import authenticated from '@/middleware/authenticated.middleware'

class ReplyController implements Controller {
  public path = '/replies'
  public router = Router()
  private replyService = new ReplyService()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.use(authenticated)

    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.create),
      this.addReply
    )
    this.router.get(`${this.path}/comment/:id`, this.getRepliesByCommentId)
    this.router.patch(
      `${this.path}/:replyId`,
      validationMiddleware(validate.update),
      this.updateReply
    )
    this.router.delete(`${this.path}/:replyId`, this.deleteReply)
  }

  private addReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reply = await this.replyService.addReply({
        ...req.body,
        user: req.user.id,
      })

      return res.status(201).json({
        status: 'success',
        message: 'Reply added successfully',
        data: reply,
      })
    } catch (error) {
      next(error)
    }
  }

  private getRepliesByCommentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit = 10, cursor } = req.query
      const commentId = req.params.id

      const replies = await this.replyService.getRepliesByCommentId(
        commentId,
        {
          limit: limit as number,
          cursor: cursor as string,
        },
        req.user.id
      )

      return res.status(200).json({
        status: 'success',
        message: 'Replies fetched successfully',
        data: replies,
      })
    } catch (error) {
      next(error)
    }
  }

  private updateReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const replyId = req.params.replyId

      const updatedReply = await this.replyService.updateReply({
        replyId,
        user: req.user.id,
        content: req.body.content,
      })

      return res.status(200).json({
        status: 'success',
        message: 'Reply updated successfully',
        data: updatedReply,
      })
    } catch (error) {
      next(error)
    }
  }

  private deleteReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const replyId = req.params.replyId

      await this.replyService.deleteReply(replyId, req.user.id)

      return res.status(200).json({
        status: 'success',
        message: 'Reply deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default ReplyController
