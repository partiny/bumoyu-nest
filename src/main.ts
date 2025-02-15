import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwagger } from './utils';
import { HttpExceptionFilter } from './core/filters';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true })
  )
  // 设置swagger
  createSwagger(app)
  
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
