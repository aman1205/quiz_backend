import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public message?: string,
    public statusCode?: number,
    public error?: any,
  ) {}

  static success<T>(data: T): ApiResponse<T>;
  static success<T>(data: T, message: string): ApiResponse<T>;
  static success<T>(data: T, statusCode: number): ApiResponse<T>;
  static success<T>(
    data: T,
    statusCode: number,
    message: string,
  ): ApiResponse<T>;
  static success<T>(
    data: T,
    statusCodeOrMessage?: number | string,
    message?: string,
  ): ApiResponse<T> {
    let statusCode: number = HttpStatus.OK;
    let finalMessage: string | undefined;

    if (typeof statusCodeOrMessage === 'number') {
      statusCode = statusCodeOrMessage;
      finalMessage = message;
    } else if (typeof statusCodeOrMessage === 'string') {
      finalMessage = statusCodeOrMessage;
    }

    return new ApiResponse<T>(true, data, finalMessage, statusCode);
  }

  static error<T>(
    error: any,
    statusCode: number,
    message?: string,
  ): ApiResponse<T> {
    return new ApiResponse<T>(false, undefined, message, statusCode, error);
  }

  static fromHttpException<T>(exception: HttpException): ApiResponse<T> {
    const statusCode = exception.getStatus();
    const errorResponse = exception.getResponse();

    if (typeof errorResponse === 'string' || errorResponse instanceof String) {
      return ApiResponse.error<T>(errorResponse.toString(), statusCode);
    }

    if (
      typeof errorResponse === 'object' &&
      errorResponse.hasOwnProperty('message')
    ) {
      return ApiResponse.error<T>(
        (errorResponse as any).message.toString(),
        statusCode,
      );
    }

    return ApiResponse.error<T>(HttpStatus[statusCode], statusCode);
  }
}
