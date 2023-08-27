import { ResponseFilter } from './response.filter';
import { ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';

describe('ResponseFilter', () => {
  let responseFilter: ResponseFilter;

  beforeEach(() => {
    responseFilter = new ResponseFilter();
  });

  it('should be defined', () => {
    expect(responseFilter).toBeDefined();
  });

  it('HttpException', () => {
    const exceptionMessage = 'Invalid input';
    const exceptionResponse = {
      message: exceptionMessage,
    };
    const httpException = new HttpException(
      exceptionResponse,
      HttpStatus.BAD_REQUEST,
    );
    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const hostMock: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
      }),
    } as ArgumentsHost;

    responseFilter.catch(httpException, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith({
      status: 'Failed',
      message: 'Invalid input',
      data: [],
    });
  });

  it('non-HttpException', () => {
    const exception = new Error('Internal server error');
    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const hostMock: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
      }),
    } as ArgumentsHost;

    responseFilter.catch(exception, hostMock);

    expect(responseMock.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(responseMock.json).toHaveBeenCalledWith({
      status: 'Failed',
      message: 'INTERNAL SERVER ERROR!',
    });
  });

  it('HttpException Array', () => {
    const mockHttpException = new HttpException(
      ['Error 1', 'Error 2'],
      HttpStatus.BAD_REQUEST,
    );
    const mockArgumentsHost: any = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => ({
          status: jest.fn(),
          json: jest.fn(),
        }),
      })),
    };

    const responseSpy = jest.spyOn(
      mockArgumentsHost.switchToHttp().getResponse(),
      'json',
    );

    responseFilter.catch(mockHttpException, mockArgumentsHost);

    expect(responseSpy).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      message: 'Parameters Invalid.',
      data: ['Error 1', 'Error 2'],
    });
  });

  it('HttpException Object', () => {
    const mockHttpException = new HttpException(
      { message: ['Error 1', 'Error 2'] },
      HttpStatus.BAD_REQUEST,
    );
    const mockArgumentsHost: any = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => ({
          status: jest.fn(),
          json: jest.fn(),
        }),
      })),
    };

    const responseSpy = jest.spyOn(
      mockArgumentsHost.switchToHttp().getResponse(),
      'json',
    );

    responseFilter.catch(mockHttpException, mockArgumentsHost);

    expect(responseSpy).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      message: 'Parameters Invalid.',
      data: ['Error 1', 'Error 2'],
    });
  });

  it('HttpException String', () => {
    const mockHttpException = new HttpException(
      'Error message',
      HttpStatus.BAD_REQUEST,
    );
    const mockArgumentsHost: any = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => ({
          status: jest.fn(),
          json: jest.fn(),
        }),
      })),
    };

    const responseSpy = jest.spyOn(
      mockArgumentsHost.switchToHttp().getResponse(),
      'json',
    );

    responseFilter.catch(mockHttpException, mockArgumentsHost);

    expect(responseSpy).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      message: 'Error message',
    });
  });
});
