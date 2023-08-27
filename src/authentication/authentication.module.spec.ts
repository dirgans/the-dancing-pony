import { Test } from '@nestjs/testing';
import { AuthenticationModule } from './authentication.module';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationModule', () => {
  it('Compile', async () => {
    const module = await Test.createTestingModule({
      imports: [AuthenticationModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AuthenticationController)).toBeInstanceOf(
      AuthenticationController,
    );
    expect(module.get(AuthenticationService)).toBeInstanceOf(
      AuthenticationService,
    );
  });
});
