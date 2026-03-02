import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_URI: str(),
        JWT_SECRET: str(),
        PORT: port({ default: 3000 }),
        STRIPE_BASE_URL: str(),
        STRIPE_SECRET_KEY: str(),
    });
}

export default validateEnv;
