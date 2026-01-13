import 'dotenv/config'
import 'module-alias/register'
import validateEnv from '@/utils/validateEnv'
import App from './app'
import PostController from '@/resources/post/post.controller'
import UserController from '@/resources/user/user.controller'
import AuthController from '@/resources/auth/auth.controller'
import UploadController from './resources/upload/upload.controller'

validateEnv()

const app = new App(
    [
        new AuthController(),
        new PostController(),
        new UserController(),
        new UploadController(),
    ],
    Number(process.env.PORT)
)

app.listen()
