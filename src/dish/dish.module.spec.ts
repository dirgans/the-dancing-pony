import { Test } from '@nestjs/testing';
import { DishModule } from './dish.module';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { JwtService } from '@nestjs/jwt';

describe('DishModule', () => {
  it('Compile', async () => {
    const module = await Test.createTestingModule({
      imports: [DishModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(DishController)).toBeInstanceOf(DishController);
    expect(module.get(DishService)).toBeInstanceOf(DishService);
    expect(module.get(JwtService)).toBeInstanceOf(JwtService);
  });
});
