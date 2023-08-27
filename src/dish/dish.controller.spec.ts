import { Test, TestingModule } from '@nestjs/testing';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import {
  createDishDto,
  dishDetailPartialResponse,
  dishDetailResponse,
  dishId,
  dishListResponse,
  rateDishDto,
  searchDishDto,
  updateDishDto,
} from './constant/dish.mock';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import fs from 'fs';
import { Response } from 'express';

describe('DishController', () => {
  let controller: DishController;
  let service: DishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishController],
      providers: [DishService, JwtService],
    }).compile();

    controller = module.get<DishController>(DishController);
    service = module.get<DishService>(DishService);
  });

  describe('Create Dish', () => {
    it('Success', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => dishDetailResponse);
      const result = controller.create(createDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('List Dish', () => {
    it('Success', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(() => dishListResponse);
      const result = controller.findAll(searchDishDto);
      expect(result).toEqual(dishListResponse);
    });
  });

  describe('Detail Dish', () => {
    it('Success', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => dishDetailResponse);
      const result = controller.findOne(dishId);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('Image Dish', () => {
    it('Success', async () => {
      const imageName = 'test_image.jpg';

      const response: Partial<Response> = {
        writeHead: jest.fn(),
        end: jest.fn(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(Buffer.from('image content'));

      controller.loadImage(imageName, response as Response);

      expect(response.writeHead).toHaveBeenCalledWith(200, {
        'Content-Type': 'image/jpeg',
      });
      expect(response.end).toHaveBeenCalledWith(
        Buffer.from('image content'),
        'binary',
      );
      expect(response.json).not.toHaveBeenCalled();
    });
  });

  describe('Update Dish', () => {
    it('Success', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => dishDetailResponse);
      const result = controller.update(dishId, updateDishDto);
      expect(result).toEqual(dishDetailResponse);
    });
  });

  describe('Remove Dish', () => {
    it('Success', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => dishDetailPartialResponse);
      const result = controller.remove(dishId);
      expect(result).toEqual(dishDetailPartialResponse);
    });
  });

  describe('Rate Dish', () => {
    it('Success', async () => {
      jest.spyOn(service, 'rate').mockImplementation(() => dishDetailResponse);
      const result = controller.rate(
        {
          user: {
            name: 'Frogo Baggins',
          },
        } as any,
        dishId,
        rateDishDto,
      );
      expect(result).toEqual(dishDetailResponse);
    });
  });
});
