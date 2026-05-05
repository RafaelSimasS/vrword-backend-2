import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const envirotment = config.get<string>('NODE_ENV');
  const port = Number(config.get<string>('PORT')) || 3001;
  const host = config.get<string>('HOST') || '0.0.0.0';

  if (envirotment === 'development') {
    app.enableCors({
      origin: ['http://localhost:3000', config.get<string>('FRONTEND_URL')],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: config.get<string>('FRONTEND_URL') || 'http://localhost:3000',
      credentials: true,
    });
  }
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  await app.listen(port, host);
  console.log(`Listening on ${host}:${port}`);
}
bootstrap();
