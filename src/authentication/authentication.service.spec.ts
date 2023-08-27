import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import {
  loginSucces,
  loginDto,
  wrongUsernameOrPasswordError,
} from './constant/login.mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService, JwtService],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('Login', () => {
    it('Success', async () => {
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => loginSucces.data?.['accessToken']);
      const result = service.login(loginDto);
      expect(result).toEqual(loginSucces);
    });

    it('Wrong nickname or password!', () => {
      loginDto.nickname = 'smeagol';
      const result = service.login(loginDto);
      expect(result).toEqual(wrongUsernameOrPasswordError);
    });
  });
});
