import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { loginDto, loginSucces } from './constant/login.mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
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

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('Login', () => {
    it('Success', async () => {
      jest.spyOn(service, 'login').mockImplementation(() => loginSucces);
      const result = controller.login(loginDto);
      expect(result).toEqual(loginSucces);
    });
  });
});
