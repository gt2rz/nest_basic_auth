import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove any extra properties sent by the client
      forbidNonWhitelisted: true, // If any extra properties are sent, return an error
    }),
  );
  await app.listen(3000);
}
bootstrap();
