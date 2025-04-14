import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerClient } from './infraestructure/configuration/clients/swagger.client';
import { GlobalExceptionFilter } from './infraestructure/configuration/clients/global-exception.client';
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RequestContextMiddleware } from './infraestructure/configuration/middlewares/request-context.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  SwaggerClient.run(app);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setBaseViewsDir(
    join(__dirname, '..', 'src', 'infraestructure', 'public'),
  );

  app.use(new RequestContextMiddleware().use.bind(this));

  app.setViewEngine('ejs');

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
