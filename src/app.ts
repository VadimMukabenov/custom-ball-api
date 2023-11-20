import express, { Application } from 'express';
import { getConfig } from "./config";
import { buildApi } from "./routes/api";
import { buildApp } from "./core/DI";
import dotenv from 'dotenv';

//For env File 
dotenv.config();

async function start() {
    const config = getConfig();
    const app = buildApp(config);
    const router = buildApi(app);

    const PORT = config.APP_PORT || 3000;
    const expressApp: Application = express();

    expressApp.use(express.json());
    expressApp.use(router);

    expressApp.listen(PORT, () =>{
        console.log(`Server is running on port new ${PORT}`);
    });
}

start();
