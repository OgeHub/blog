import { Document } from 'mongoose';

interface Post extends Document {
    title: string;
    body: string;
}

export default Post;
