import { Document } from 'mongoose';

interface User extends Document {
    username: string;
    name: string;
    password: string;
    email: string;
    role: string;

    isValidPassword(password: string): Promise<Error | Boolean>;
}

export default User;
