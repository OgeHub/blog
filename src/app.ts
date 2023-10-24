import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
    /** Declare express and port */
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeBaseURL();
        this.initializeErrorHandling();
    }

    /** Middlewares */
    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    /** Set base /api route for all endpoints */
    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeBaseURL(): any {
        this.express.get('/api', (req, res) => {
            return res.status(200).send({
                status: 'success',
                message: 'Welcome to Blog API',
            });
        });
    }

    /** Error Middleware */
    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    /** Configure database connection */
    private initializeDatabaseConnection(): void {
        const { DATABASE_PATH, DATABASE_PASSWORD, DATABASE_USER } = process.env;

        mongoose
            .connect(
                `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}${DATABASE_PATH}`
            )
            .then(() => console.log('Database connected successfully'));
    }

    /** Set server to listen */
    public listen() {
        this.express.listen(this.port, () =>
            console.log(`App is running on port: ${this.port}`)
        );
    }
}

export default App;
