import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const envirotment = config.get<string>('NODE_ENV');

  if (envirotment === 'development') {
    app.enableCors({
      origin: ['http://localhost:3000', 'http://10.243.201.221:3000'],
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
  await app.listen(3001);
  console.log('Listening on http://localhost:3001');
}
bootstrap();
