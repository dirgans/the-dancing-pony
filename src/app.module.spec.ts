import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { DishModule } from './dish/dish.module';

describe('AppModule', () => {
  it('Compile', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AuthenticationModule)).toBeInstanceOf(
      AuthenticationModule,
    );

    expect(module).toBeDefined();
    expect(module.get(DishModule)).toBeInstanceOf(DishModule);
  });
});
