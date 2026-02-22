import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Express } from 'express';

let cachedServer: any;

async function bootstrap() {
    if (!cachedServer) {
        const nestApp = await NestFactory.create(AppModule);
        nestApp.enableCors({
            origin: ["http://localhost:5173", "https://apius.reqbin.com/api/v1", "https://vercel.com"],
            credentials: true,
        });
        await nestApp.init();
        const expressApp = nestApp.getHttpAdapter().getInstance();
        cachedServer = serverlessExpress({ app: expressApp });
    }
    return cachedServer;
}

export const handler = async (event: any, context: any, callback: any) => {
    const server = await bootstrap();
    return server(event, context, callback);
};
