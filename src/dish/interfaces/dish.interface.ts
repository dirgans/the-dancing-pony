import { IList } from 'src/common/interfaces/list.interface';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateDishDto } from '../dto/create-dish.dto';
import { SearchDishDto } from '../dto/search-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';
import { RateDishDto } from '../dto/rate-dish.dto';

export interface IDishDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  currency: string;
  price: number;
  rate: number;
  reviewers: Record<string, any>[];
}

export interface IDishService {
  create(createDishDto: CreateDishDto): IResponse<IDishDetail>;
  findAll(searchDishDto: SearchDishDto): IResponse<IList<IDishDetail>>;
  findOne(id: string): IResponse<IDishDetail>;
  update(id: string, updateDishDto: UpdateDishDto): IResponse<IDishDetail>;
  remove(id: string): IResponse<Partial<IDishDetail>>;
  rate(
    id: string,
    name: string,
    rateDishDto: RateDishDto,
  ): IResponse<IDishDetail>;
}
