import { IsBase64, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum ECurrency {
  USD = 'USD',
  IDR = 'IDR',
}

export class CreateDishDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBase64()
  image: string;

  @IsNotEmpty()
  @IsString()
  currency: ECurrency;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
