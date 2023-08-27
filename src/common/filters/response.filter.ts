import { HttpException, HttpStatus } from '@nestjs/common';
import { Catch } from '@nestjs/common/decorators';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpArgumentsHost,
} from '@nestjs/common/interfaces';
import { IResponse } from '../interfaces/response.interface';

@Catch()
export class ResponseFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: any = ctx.getResponse();
    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorContent: Partial<IResponse<any>> = {
      status: 'Failed',
    };
    let errors = [];
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionHttp: Record<string, any> = exception;
      const exceptionData: Record<string, any> | string[] =
        exceptionHttp.response;
      errorContent.message = 'Parameters Invalid.';
      if (Array.isArray(exceptionData)) {
        errors = exceptionData.map((message) => message);
      } else if (Array.isArray(exceptionData.message)) {
        errors = exceptionData.message.map((message) => message);
      } else {
        errorContent.message = exceptionData.message;
      }
      errorContent.data = errors;
    } else {
      errorContent.message = 'INTERNAL SERVER ERROR!';
    }
    response.status(status).json(errorContent);
  }
}
