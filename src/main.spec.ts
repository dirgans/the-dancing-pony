import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { bootstrap } from './main';

describe('Main', () => {
  let loggerMock: Logger;
  let createAppMock;
  let appMock: NestExpressApplication;

  beforeEach(() => {
    loggerMock = {
      log: jest.fn(),
    } as unknown as Logger;

    appMock = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
      getUrl: jest.fn().mockReturnValue('http://localhost:3000'),
    } as unknown as NestExpressApplication;

    createAppMock = jest
      .spyOn(NestFactory, 'create')
      .mockResolvedValue(appMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Nest application listen', async () => {
    await bootstrap();

    expect(createAppMock).toHaveBeenCalledWith(AppModule);
    expect(appMock.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );
    expect(appMock.listen).toHaveBeenCalledWith(3000);
  });
});
