import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

class PostService {
    /**Create a post */
    public async create(
        title: string,
        body: string,
        userID: number
    ): Promise<Post> {
        try {
            const post = await PostModel.create({
                title,
                body,
                userID,
            });

            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }

    /**Get details of a post */
    public async getPost(id: string): Promise<any> {
        try {
            const post = await PostModel.findById(id);

            return post;
        } catch (error) {
            throw Error('Unable to retrieve post');
        }
    }

    /**Get all posts */
    public async getAllPosts(): Promise<any> {
        try {
            const posts = await PostModel.find().sort({ createdAt: -1 });

            return posts;
        } catch (error) {
            throw Error('Unable to retrieve posts');
        }
    }

    /**Delete post */
    public async deletePost(id: string, userID: number): Promise<void> {
        try {
            const post = await PostModel.findOneAndDelete({ _id: id, userID });
        } catch (error) {
            throw Error('Unable to delete post');
        }
    }

    /**Edit post */
    public async editPost(
        id: string,
        userID: number,
        data: object
    ): Promise<any> {
        try {
            const post = await PostModel.findOneAndUpdate(
                { _id: id, userID },
                data,
                { new: true, runValidators: true }
            );

            return post;
        } catch (error) {
            throw Error('Unable to edit post');
        }
    }
}

export default PostService;
