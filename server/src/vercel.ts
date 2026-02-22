import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@codegenie/serverless-express';

let cachedServer: any;

async function bootstrap() {
    if (!cachedServer) {
        try {
            console.log('Bootstrapping NestJS application...');
            const nestApp = await NestFactory.create(AppModule);
            nestApp.enableCors({
                origin: ["http://localhost:5173", "https://apius.reqbin.com/api/v1", "https://vercel.com"],
                credentials: true,
            });
            console.log('Initializing NestJS...');
            await nestApp.init();
            const expressApp = nestApp.getHttpAdapter().getInstance();
            cachedServer = serverlessExpress({ app: expressApp });
            console.log('NestJS application bootstrapped successfully.');
        } catch (error) {
            console.error('Error during bootstrapping:', error);
            throw error;
        }
    }
    return cachedServer;
}

export const handler = async (event: any, context: any, callback: any) => {
    try {
        const server = await bootstrap();
        return server(event, context, callback);
    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
