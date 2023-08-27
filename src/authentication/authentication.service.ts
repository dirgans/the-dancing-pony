import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';
import { IUserDetail } from './interfaces/user.interfaces';
import {
  IAuthenticationService,
  ILoginResponse,
} from './interfaces/authentication.interface';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/common/interfaces/response.interface';
import _ from 'lodash';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  private users: IUserDetail[] = [
    {
      id: randomUUID(),
      name: 'Frogo Baggins',
      nickname: 'baggins',
      password: 'Th3R1ng$',
      isActive: true,
      age: 30,
      permissions: [
        'dish.list',
        'dish.detail',
        'dish.create',
        'dish.update',
        'dish.delete',
        'dish.rate',
      ],
    },
    {
      id: randomUUID(),
      name: 'Sméagol',
      nickname: 'smeagol',
      password: 'Y0uShallN0tPa$$',
      isActive: true,
      age: 90,
      permissions: [
        'dish.list',
        'dish.detail',
        'dish.create',
        'dish.update',
        'dish.delete',
      ],
    },
  ];

  public login(loginDto: LoginDto): IResponse<ILoginResponse> {
    const { nickname, password } = loginDto;

    const findUser = _.cloneDeep(
      this.users.find(
        (user) =>
          user.nickname === nickname &&
          user.password === password &&
          user.isActive,
      ),
    );

    if (!findUser) {
      return {
        status: 'Failed',
        message: 'Wrong nickname or password.',
      };
    }

    delete findUser.password;

    return {
      status: 'Success',
      message: 'Login successfully!',
      data: {
        accessToken: this.jwtService.sign(findUser, {
          expiresIn: process.env.JWT_EXPIRED,
          privateKey: process.env.JWT_PRIVATE_KEY,
        }),
      },
    };
  }
}
