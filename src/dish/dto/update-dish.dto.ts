import { PartialType } from '@nestjs/mapped-types';
import { CreateDishDto, ECurrency } from './create-dish.dto';
import { IsBase64, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDishDto extends PartialType(CreateDishDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBase64()
  image?: string;

  @IsOptional()
  @IsString()
  currency?: ECurrency;

  @IsOptional()
  @IsNumber()
  price?: number;
}
