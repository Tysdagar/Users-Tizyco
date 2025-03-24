import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerClient } from './infraestructure/configuration/clients/swagger.client';
import { GlobalExceptionFilter } from './infraestructure/filters/exception.filter';
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

/**
 * Bootstraps the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Initialize Swagger for API documentation.
  SwaggerClient.run(app);

  // Set up global exception filters.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configure the base directory for views and the view engine.
  app.setBaseViewsDir(
    join(__dirname, '..', 'src', 'infraestructure', 'public'),
  );

  app.setViewEngine('ejs');

  // Start the application on the specified port.
  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
