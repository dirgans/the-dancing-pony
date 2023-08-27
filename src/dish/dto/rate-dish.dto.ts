import { IsNotEmpty, IsNumber } from 'class-validator';

export class RateDishDto {
  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
