import { Document } from 'mongoose';

interface Post extends Document {
    userID: number;
    title: string;
    body: string;
}

export default Post;
