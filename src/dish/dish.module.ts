import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DishController],
  providers: [DishService, JwtService],
})
export class DishModule {}
