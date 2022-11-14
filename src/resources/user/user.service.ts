import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';

class UserService {
    public async register(
        userID: number,
        username: string,
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<object | Error> {
        try {
            const user = await UserModel.create({
                userID,
                username,
                name,
                email,
                password,
                role,
            });

            const accessToken = await token.createToken(user);

            return { accessToken, user };
        } catch (error) {
            throw Error('Unable to create user');
        }
    }

    public async loginWithEmail(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            // Find User
            const user = await UserModel.findOne({ email });
            if (!user) throw Error('User not found');

            // Check if password is correct
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw Error('Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            throw Error('Unable to login');
        }
    }

    public async loginWithUsername(
        username: string,
        password: string
    ): Promise<string | Error> {
        try {
            // Find user
            const user = await UserModel.findOne({ username });
            if (!user) throw Error('User not found');

            // Check if password is correct
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw Error('Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            throw Error('Unable to login');
        }
    }

    public async getUser(id: string): Promise<object | null> {
        try {
            const user = await UserModel.findById(id);

            return user;
        } catch (error) {
            throw Error('User not found');
        }
    }

    public async getAllUsers(): Promise<any> {
        try {
            const users = await UserModel.find().sort({ createdAt: -1 });

            return users;
        } catch (error) {
            throw Error('Users not found');
        }
    }

    public async editUser(userID: number, data: object): Promise<any> {
        try {
            const user = await UserModel.findOneAndUpdate({ userID }, data, {
                new: true,
                runValidators: true,
            });

            return user;
        } catch (error) {
            throw Error('Unable to edit user details');
        }
    }
}

export default UserService;
