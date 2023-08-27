import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export type TOrder = 'ASC' | 'DESC';

export class SearchDishDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order: TOrder;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value || 10))
  limit: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value || 1))
  page: number;
}
