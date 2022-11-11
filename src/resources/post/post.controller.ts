import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import authenticated from '@/middleware/authenticated.middleware';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    /** Initialize all post endpoints */
    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            authenticated,
            this.create
        );

        this.router.get(`${this.path}/:id`, authenticated, this.getPost);
        this.router.get(`${this.path}`, authenticated, this.getPosts);
    }

    /** Post Controllers */
    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);

            res.status(201).json({ post });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const post = await this.PostService.getPost(id);

            res.status(200).json({
                message: 'Post retrieved successfully',
                data: post,
            });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };

    private getPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.PostService.getAllPosts();
            res.status(200).json({
                message: 'Posts retrieved successfully',
                data: posts,
            });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };
}

export default PostController;
