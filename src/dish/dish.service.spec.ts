import { Test, TestingModule } from '@nestjs/testing';
import { DishService } from './dish.service';
import { JwtService } from '@nestjs/jwt';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import {
  createDishDto,
  dishDetail,
  dishDetailPartialResponse,
  dishDetailResponse,
  dishId,
  dishListResponse,
  rateDishDto,
  searchDishDto,
  updateDishDto,
} from './constant/dish.mock';

const moduleMocker = new ModuleMocker(global);

describe('DishService', () => {
  let service: DishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishService, JwtService],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<DishService>(DishService);
  });

  describe('List', () => {
    it('Success', async () => {
      const result = service.findAll(searchDishDto);
      expect(result).toEqual(dishListResponse);
    });

    it('Failed', async () => {
      const result = service.findAll({
        search: undefined,
        sort: undefined,
        order: undefined,
        limit: undefined,
        page: undefined,
      });
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('Detail', () => {
    it('Success', async () => {
      const result = service.findOne(dishId);
      expect(result).toEqual(dishListResponse);
    });

    it('Failed', async () => {
      const result = service.findOne('1');
      expect(result).toEqual(dishListResponse);
    });
  });

  describe('Create', () => {
    it('Success', async () => {
      jest.spyOn(service, 'mapper').mockImplementation(() => dishDetail);

      const result = service.create({
        ...createDishDto,
        name: 'Salad',
        description: 'Full vegetables',
      });
      expect(result).toEqual(dishDetailResponse);
    });

    it('Failed', async () => {
      jest.spyOn(service, 'mapper').mockImplementation(() => dishDetail);
      const result = service.create(createDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('Update', () => {
    it('Success', async () => {
      jest.spyOn(service, 'mapper').mockImplementation(() => dishDetail);
      const result = service.update(dishId, updateDishDto);
      expect(result).toEqual(dishDetailResponse);
    });

    it('Failed', async () => {
      jest.spyOn(service, 'mapper').mockImplementation(() => dishDetail);
      const result = service.update('1', updateDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('Remove', () => {
    it('Success', async () => {
      const result = service.remove(dishId);
      expect(result).toEqual(dishDetailPartialResponse);
    });

    it('Failed', async () => {
      const result = service.remove('1');
      expect(result).toEqual(dishDetailPartialResponse);
    });
  });

  describe('Rate', () => {
    it('Success', async () => {
      const result = service.rate(dishId, 'Frogo Baggins', rateDishDto);
      expect(result).toEqual(dishDetailResponse);
    });

    it('Failed', async () => {
      const result = service.rate('1', 'Frogo Baggins', rateDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('mapper', () => {
    it('Success', async () => {
      const result = service.mapper(createDishDto, dishDetail);
      expect(result).toEqual(dishDetailResponse);
    });

    it('Without current data.', async () => {
      const result = service.mapper(createDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });
});
