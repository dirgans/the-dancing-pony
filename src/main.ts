import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const logger = new Logger('The Dancing Pony');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
    }),
  );

  await app.listen(3000);

  logger.log('Application is running on ' + (await app.getUrl()));
}
bootstrap();
