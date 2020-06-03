import express from 'express';
import routes from './routes';
import cors from 'cors';

class App {
    public express: express.Application 
    constructor() {
        this.express = express()
        this.useCors()
        this.middlewares()
        this.routes()
    }

    private useCors(): void {
        this.express.use(cors())
    }

    private middlewares(): void {
        this.express.use(express.json())
    }

    private routes(): void {
        this.express.use(routes)
    }

}

export default new App().express;