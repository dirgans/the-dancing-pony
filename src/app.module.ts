import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { DishModule } from './dish/dish.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthenticationModule, DishModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
