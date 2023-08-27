import { Injectable } from '@nestjs/common';
import { CreateDishDto, ECurrency } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { RateDishDto } from './dto/rate-dish.dto';
import { SearchDishDto } from './dto/search-dish.dto';
import { IDishDetail, IDishService } from './interfaces/dish.interface';
import { randomUUID } from 'crypto';
import { IResponse } from '../common/interfaces/response.interface';
import { UploadBase64Manager } from '../common/upload/base64-upload.manager';
import { IList } from '../common/interfaces/list.interface';
import _ from 'lodash';

/**
 * Service responsible for managing dish-related operations.
 */
@Injectable()
export class DishService implements IDishService {
  private dishes: IDishDetail[] = [
    {
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
    },
    {
      id: '6b8c69db-3c46-40dd-bb91-4e8f3303a31e',
      name: 'Rendang',
      description:
        'Rendang is a traditional Indonesian dish that is renowned for its rich and complex flavors. It originates from the Minangkabau ethnic group in West Sumatra, Indonesia. Rendang is often considered a type of "dry curry" due to its thick, flavorful sauce that coats the meat.',
      image: 'dish_1692931239852.JPG',
      currency: ECurrency.USD,
      price: 10,
      rate: 0,
      reviewers: [],
    },
    {
      id: '36780afe-4e02-4f31-8d77-344455ffcefb',
      name: 'Gelato',
      description:
        'Gelato is a traditional Italian frozen dessert that shares many similarities with ice cream but possesses its own distinct characteristics. Known for its creamy texture and intense flavors, gelato is a beloved treat enjoyed both in Italy and around the world.',
      image: 'dish_1692931239853.JPG',
      currency: ECurrency.USD,
      price: 3,
      rate: 0,
      reviewers: [],
    },
  ];

  /**
   * Create a new dish.
   *
   * @param createDishDto - The DTO containing information to create the dish.
   * @returns An IResponse containing the status and message, and if successful, the created dish data.
   */
  create(createDishDto: CreateDishDto): IResponse<IDishDetail> {
    const isDishExist = this.dishes.findIndex(
      (dish) =>
        dish.name === createDishDto.name ||
        dish.description === createDishDto.description,
    );

    if (isDishExist >= 0) {
      return {
        status: 'Failed',
        message: 'Name or description already exist!',
      };
    }

    const data: IDishDetail = this.mapper(createDishDto);

    this.dishes.push(data);

    return {
      status: 'Success',
      message: 'Dish has been created.',
      data,
    };
  }

  /**
   * Retrieve a list of dishes based on search criteria.
   *
   * @param searchDishDto - The DTO containing search criteria.
   * @returns An IResponse containing the status, message, and a list of found dishes with pagination details.
   */
  findAll(searchDishDto: SearchDishDto): IResponse<IList<IDishDetail>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'name',
      order = 'ASC',
    } = searchDishDto;
    const searchLowerCase = search.toLowerCase();

    const offset = (page - 1) * limit;

    const data: IDishDetail[] = this.dishes
      .filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchLowerCase) ||
          dish.description.toLowerCase().includes(searchLowerCase),
      )
      .sort((a, b) =>
        order === 'ASC'
          ? a[sort].localeCompare(b[sort])
          : b[sort].localeCompare(a[sort]),
      )
      .slice(offset, limit);

    return {
      status: 'Success',
      message: 'Dish has been found.',
      data: {
        content: this.reserveDishResponse(data),
        pagination: {
          page,
          total: this.dishes.length,
          size: data.length,
          rows_per_page: limit,
        },
      },
    };
  }

  /**
   * Retrieve a single dish by its ID.
   *
   * @param id - The ID of the dish to retrieve.
   * @returns An IResponse containing the status, message, and the retrieved dish data if found.
   */
  findOne(id: string): IResponse<IDishDetail> {
    const dish = this.dishes.find((dish) => dish.id === id);

    if (!dish) {
      return {
        status: 'Failed',
        message: 'Dish not found.',
      };
    }

    return {
      status: 'Success',
      message: 'Dish has been found.',
      data: this.reserveDishResponse([dish])[0],
    };
  }

  /**
   * Update an existing dish.
   *
   * @param id - The ID of the dish to update.
   * @param updateDishDto - The DTO containing updated dish information.
   * @returns An IResponse containing the status, message, and the updated dish data if successful.
   */
  update(id: string, updateDishDto: UpdateDishDto): IResponse<IDishDetail> {
    const isDishExist = this.dishes.findIndex(
      (dish) =>
        dish.id != id &&
        (dish.name === updateDishDto.name ||
          dish.description === updateDishDto.description),
    );

    if (isDishExist >= 0) {
      return {
        status: 'Failed',
        message: 'Name or description already exist!',
      };
    }

    const dish = this.dishes.find((dish) => dish.id === id);

    const data: IDishDetail = this.mapper(updateDishDto, dish);

    this.dishes.push(data);

    return {
      status: 'Success',
      message: 'Dish has been updated.',
      data: this.reserveDishResponse([dish])[0],
    };
  }

  /**
   * Remove a dish by its ID.
   *
   * @param id - The ID of the dish to remove.
   * @returns An IResponse containing the status, message, and data about the removed dish if successful.
   */
  remove(id: string): IResponse<Partial<IDishDetail>> {
    const deletedIndex = this.dishes.findIndex((dish) => dish.id === id);

    if (deletedIndex > -1) {
      this.dishes.splice(deletedIndex, 1);
    } else {
      return {
        status: 'Failed',
        message: 'Dish not found.',
      };
    }

    return {
      status: 'Success',
      message: 'Dish has been deleted.',
      data: { id },
    };
  }

  /**
   * Rate a dish.
   *
   * @param id - The ID of the dish to rate.
   * @param name - The name of the reviewer.
   * @param rateDishDto - The DTO containing the rating information.
   * @returns An IResponse containing the status, message, and the updated dish data if successful.
   */
  rate(
    id: string,
    name: string,
    rateDishDto: RateDishDto,
  ): IResponse<IDishDetail> {
    const updatedIndex = this.dishes.findIndex((dish) => dish.id === id);

    if (updatedIndex > -1) {
      this.dishes[updatedIndex].reviewers = this.dishes[
        updatedIndex
      ].reviewers.concat([{ name, rate: rateDishDto.rate }]);

      this.dishes[updatedIndex].rate =
        this.dishes[updatedIndex].reviewers.reduce((a, b) => a + b.rate, 0) /
        this.dishes[updatedIndex].reviewers.length;
    } else {
      return {
        status: 'Failed',
        message: 'Dish not found.',
      };
    }

    return {
      status: 'Success',
      message: 'Dish rate has been updated.',
      data: this.reserveDishResponse([this.dishes[updatedIndex]])[0],
    };
  }

  // Private methods...

  /**
   * Map dish DTO to dish detail data.
   *
   * @param dishDto - The dish DTO to map.
   * @param currentData - The current dish data if updating.
   * @returns The mapped dish detail data.
   * @private
   */
  mapper(
    dishDto: CreateDishDto | UpdateDishDto,
    currentData?: IDishDetail,
  ): IDishDetail {
    const data = Object.assign(
      currentData || { id: randomUUID(), rate: 0 },
      dishDto,
    ) as IDishDetail;

    if (!!dishDto.image) {
      const uploadManager = new UploadBase64Manager(
        dishDto.image,
        'images',
        'dish_',
      );

      uploadManager.store();

      data.image = uploadManager.fileName;
    }

    return data;
  }

  /**
   * Modify image URLs in dish details.
   *
   * @param dishes - The list of dish details to modify.
   * @returns The modified list of dish details with image URLs.
   * @private
   */
  reserveDishResponse(dishes: IDishDetail[]): IDishDetail[] {
    const newDishes: IDishDetail[] = _.cloneDeep(dishes);
    newDishes.forEach(
      (dish) => (dish.image = process.env.DISH_IMAGE_URL + dish.image),
    );
    return newDishes;
  }
}
