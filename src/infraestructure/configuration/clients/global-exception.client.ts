import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CustomError } from 'src/domain/common/errors/configuration/custom-error.config';

/**
 * A global exception filter for handling all uncaught exceptions in a NestJS application.
 *
 * - Catches exceptions and sends a structured response to the client.
 * - Specifically handles instances of `CustomError` for more granular error reporting.
 * - Logs other unhandled exceptions and returns a generic 500 Internal Server Error response.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Handles the caught exception and sends an appropriate HTTP response.
   *
   * @param exception - The exception that was thrown.
   * @param host - The context of the request where the exception occurred.
   */
  public catch(exception: Error, host: ArgumentsHost) {
    // Extract HTTP context from the ArgumentsHost
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle CustomError instances with specific error codes and JSON payload
    if (exception instanceof CustomError) {
      response.status(exception.getErrorCode()).json(exception.toJSON());
    } else {
      // Respond with a generic 500 Internal Server Error
      console.log(exception);
      response
        .status(500)
        .json({ error: 'Internal Error', stack: exception.stack });
    }
  }
}
