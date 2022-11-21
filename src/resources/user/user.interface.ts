import { Document } from 'mongoose';

interface User extends Document {
    userID: number;
    username: string;
    name: string;
    password: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    emailVerificationToken: any;
    verificationTokenExpires: any;

    isValidPassword(password: string): Promise<Error | Boolean>;
    getEmailVerificationToken(): string;
}

export default User;
