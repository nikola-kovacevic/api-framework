/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

const getMessage = (exception: any): string => {
  if (exception instanceof HttpException && exception.message) {
    return exception.message.message || 'Something bad happened';
  }
  return 'Something bad happened';
};

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = getMessage(exception);

    response.status(status).json({
      statusCode: status,
      correlation: response.locals.correlation,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
