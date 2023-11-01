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
        this.router.delete(`${this.path}/:id`, authenticated, this.deletePost);
        this.router.patch(
            `${this.path}/:id`,
            authenticated,
            validationMiddleware(validate.edit),
            this.editPost
        );
    }

    /** Post Controllers */

    /**Create a post */
    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const userID = req.user.userID;
            const post = await this.PostService.create(title, body, userID);

            res.status(201).json({
                status: 'success',
                message: 'Post created successfully',
                data: post,
            });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    /**Get a post */
    private getPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const post = await this.PostService.getPost(id);

            res.status(200).json({
                status: 'success',
                message: 'Post retrieved successfully',
                data: post,
            });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };

    /**Get all posts */
    private getPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.PostService.getAllPosts();
            res.status(200).json({
                status: 'success',
                message: 'Posts retrieved successfully',
                data: posts,
            });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };

    /**Delete post */
    private deletePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const userID = req.user.userID;
            const post = await this.PostService.deletePost(id, userID);
            res.status(200).json({
                status: 'success',
                message: 'Post deleted successfully',
            });
        } catch (error: any) {
            next(new HttpException(error.statusCode, error.message));
        }
    };

    /**Edit post */
    private editPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const id = req.params.id;
        const userID = req.user.userID;
        const { title, body } = req.body;
        const post = await this.PostService.editPost(id, userID, {
            title,
            body,
        });

        res.status(200).json({
            status: 'success',
            message: 'Post edited successfully',
            data: post,
        });
    };
}

export default PostController;
