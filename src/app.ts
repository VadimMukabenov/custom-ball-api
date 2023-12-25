import express, { Application } from 'express';
import { getConfig } from "./config";
import { buildApi } from "./routes/api";
import { buildApp } from "./core/DI";
import dotenv from 'dotenv';
import cors, { CorsOptions } from "cors";
import Container from './core/DI/container';

//For env File 
dotenv.config();

async function start() {
    const config = getConfig();
    const container = await Container.init();
    const app = await buildApp(container);
    const router = buildApi(app);

    const PORT = config.APP_PORT || 3000;
    const expressApp: Application = express();

    const whitelist = ['https://i.moymyach.ru', 'http://localhost:5173']
    const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
            if(!origin){//for bypassing postman req with  no origin
                return cb(null, true);
            }
            if (whitelist.indexOf(origin) > -1) {
                cb(null, true)
            } else {
                cb(new Error('Запрещено CORS'))
            }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 200,
    }
    expressApp.use(cors(corsOptions))
    expressApp.use(express.json());
    expressApp.use(router);

    expressApp.listen(PORT, () =>{
        console.log(`Server is running on port new ${PORT}`);
    });
}

start();
