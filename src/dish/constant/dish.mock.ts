import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateDishDto, ECurrency } from '../dto/create-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';
import { IDishDetail } from '../interfaces/dish.interface';
import { IList } from 'src/common/interfaces/list.interface';
import { SearchDishDto } from '../dto/search-dish.dto';
import { RateDishDto } from '../dto/rate-dish.dto';

export const createDishDto: CreateDishDto = {
  name: 'Spaghetti',
  description:
    'Spaghetti is a popular type of pasta characterized by its long, thin, cylindrical shape. It is a staple in Italian cuisine and is widely enjoyed around the world. Spaghetti is often made from durum wheat semolina and water, resulting in a firm and chewy texture when cooked.',
  image: 'dish_1692931239851.JPG',
  currency: ECurrency.USD,
  price: 5,
};

export const updateDishDto: UpdateDishDto = {
  price: 5,
};

export const searchDishDto: SearchDishDto = {
  page: 1,
  limit: 10,
  sort: 'name',
  order: 'ASC',
  search: 'Spaghetti',
};

export const rateDishDto: RateDishDto = {
  rate: 4,
};

export const dishId = '03b41a48-67e6-4359-b556-86afb6d77d53';

export const dishDetail: IDishDetail = {
  id: '03b41a48-67e6-4359-b556-86afb6d77d53',
  name: 'Spaghetti',
  description:
    'Spaghetti is a popular type of pasta characterized by its long, thin, cylindrical shape. It is a staple in Italian cuisine and is widely enjoyed around the world. Spaghetti is often made from durum wheat semolina and water, resulting in a firm and chewy texture when cooked.',
  image: 'dish_1692931239851.JPG',
  currency: ECurrency.USD,
  price: 5,
  rate: 4,
  reviewers: [
    {
      name: 'Frogo Baggins',
      rate: 4,
    },
  ],
};

export const dishDetailResponse: IResponse<IDishDetail> = {
  status: 'Success',
  message: '',
  data: dishDetail,
};

export const dishDetailPartialResponse: IResponse<Partial<IDishDetail>> = {
  status: 'Success',
  message: '',
  data: dishDetail,
};

export const dishListResponse: IResponse<IList<IDishDetail>> = {
  status: 'Success',
  message: '',
  data: {
    content: [dishDetail],
    pagination: {
      page: 1,
      total: 10,
      size: 10,
      rows_per_page: 10,
    },
  },
};
