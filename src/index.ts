import 'dotenv/config'
import 'module-alias/register'
import validateEnv from '@/utils/validateEnv'
import App from './app'
import PostController from '@/resources/post/post.controller'
import UserController from '@/resources/user/user.controller'
import AuthController from '@/resources/auth/auth.controller'
import UploadController from './resources/upload/upload.controller'
import CommentController from './resources/comment/comment.controller'
import ReplyController from './resources/reply/reply.controller'
import ClapController from './resources/clap/clap.controller'
import SubscriptionController from './resources/subscription/subscription.controller'

validateEnv()

const app = new App(
  [
    new AuthController(),
    new PostController(),
    new UserController(),
    new UploadController(),
    new CommentController(),
    new ReplyController(),
    new ClapController(),
    new SubscriptionController(),
  ],
  Number(process.env.PORT)
)

// handle app crash TODO

app.listen()
