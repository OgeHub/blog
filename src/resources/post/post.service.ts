import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

class PostService {
    public async create(title: string, body: string): Promise<Post> {
        try {
            const post = await PostModel.create({ title, body });

            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }

    public async getPosts(): Promise<any> {
        try {
            const posts = await PostModel.find();

            return posts;
        } catch (error) {
            throw Error('Unable to retrieve post');
        }
    }
}

export default PostService;
