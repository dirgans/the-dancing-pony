import { JwtGuard } from './jwt.guard';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('JwtGuard', () => {
  let jwtGuard: JwtGuard;
  let reflector: Reflector;
  let jwtService: JwtService;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as unknown as Reflector;

    jwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;

    jwtGuard = new JwtGuard(reflector, jwtService);
  });

  it('Valid permission', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'valid-token' },
      }),
      getHandler: jest.fn().mockReturnValue(() => ['dish.list']),
    };
    const payload = {
      id: 'user-id',
      permissions: ['dish.list', 'dish.detail', 'dish.create'],
    };

    jwtService.verify = jest.fn().mockReturnValue(payload);
    reflector.get = jest.fn().mockReturnValue(['dish.list']);

    const result = jwtGuard.canActivate(context as any);

    expect(result).toEqual(true);
    expect(context.getRequest).toHaveBeenCalledTimes(1);
    expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
    expect(reflector.get).toHaveBeenCalledTimes(1);
  });

  it('Token is required', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {},
      }),
    };

    expect(() => jwtGuard.canActivate(context as any)).toThrowError(
      UnauthorizedException,
    );
  });

  it('Token is invalid', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'invalid-token' },
      }),
    };

    jwtService.verify = jest.fn(() => {
      throw new Error('Invalid token');
    });

    expect(() => jwtGuard.canActivate(context as any)).toThrowError(
      UnauthorizedException,
    );
  });

  it('No permission to access', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'valid-token' },
      }),
      getHandler: jest.fn().mockReturnValue(() => ['dish.list']),
    };
    const payload = {
      id: 'user-id',
      permissions: ['dish.detail', 'dish.create'],
    };

    jwtService.verify = jest.fn().mockReturnValue(payload);
    reflector.get = jest.fn().mockReturnValue(undefined);

    expect(() => jwtGuard.canActivate(context as any)).toThrowError(
      ForbiddenException,
    );
  });
});
