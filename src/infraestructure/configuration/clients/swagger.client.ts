import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * SwaggerClient is a singleton class responsible for configuring Swagger
 * documentation for the NestJS application.
 */
export class SwaggerClient {
  /**
   * Static instance to ensure the Singleton pattern.
   */
  private static instance: SwaggerClient;

  /**
   * Private constructor to enforce the Singleton pattern.
   *
   * @param app - The NestJS application instance.
   */
  private constructor(app: INestApplication) {
    // Define the Swagger document configuration
    const config = new DocumentBuilder()
      .setTitle('Usuarios') // Title of the API
      .setDescription('Usuarios Api') // Description of the API
      .setVersion('1.0')
      .addApiKey(
        { type: 'apiKey', name: 'x-forwarded-for', in: 'header' },
        'x-forwarded-for',
      )
      .build();

    // Create the Swagger document
    const document = SwaggerModule.createDocument(app, config);

    // Set up the Swagger UI at the '/api' endpoint
    SwaggerModule.setup('api', app, document);
  }

  /**
   * Ensures a single instance of the SwaggerClient.
   *
   * @param app - The NestJS application instance.
   * @returns The single instance of SwaggerClient.
   */
  private static getInstance(app: INestApplication): SwaggerClient {
    if (!SwaggerClient.instance) {
      SwaggerClient.instance = new SwaggerClient(app);
    }
    return SwaggerClient.instance;
  }

  /**
   * Initializes and runs the SwaggerClient for the provided NestJS application.
   *
   * @param app - The NestJS application instance.
   */
  public static run(app: INestApplication) {
    SwaggerClient.getInstance(app);
  }
}
