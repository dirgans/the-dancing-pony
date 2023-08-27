import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserDetail } from '../interfaces/user.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw new UnauthorizedException('Token is required.');
    }

    const token: string = req.headers.authorization;
    const payload: IUserDetail = this.verify(token);

    if (!payload) throw new UnauthorizedException('Token is invalid.');

    const permissions =
      this.reflector.get<string[]>('permission', context.getHandler()) ?? [];

    const isAllowed = permissions.filter((permission) =>
      payload.permissions.includes(permission),
    );

    if (!isAllowed.length) {
      throw new ForbiddenException('No permission to access this api.');
    }

    req.user = Object.assign({}, payload);

    return true;
  }

  private verify(token: string) {
    try {
      return this.jwtService.verify(token.replace('Bearer ', ''), {
        publicKey: process.env.JWT_PUBLIC_KEY,
      });
    } catch (error) {
      console.error('ERROR VERIFY TOKEN:', error.message);
      return null;
    }
  }
}
