import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UseGuards,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ResponseFilter } from '../common/filters/response.filter';
import { JwtGuard } from '../authentication/jwt/jwt.guard';
import { Permission } from '../authentication/constant/permission-metadata.constant';
import { SearchDishDto } from './dto/search-dish.dto';
import { RateDishDto } from './dto/rate-dish.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { IList } from '../common/interfaces/list.interface';
import { IDishDetail } from './interfaces/dish.interface';
import { Request, Response } from 'express';
import fs from 'fs';
import { IUserDetail } from '../authentication/interfaces/user.interfaces';
import { join } from 'path';

@UseFilters(ResponseFilter)
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  /**
   * Creates a new dish.
   *
   * This route allows authenticated users with 'dish.create' permission to
   * create a new dish using the provided dish details.
   *
   * @param createDishDto - The details of the dish to be created.
   * @returns The newly created dish.
   */
  @Post()
  @UseGuards(JwtGuard)
  @Permission('dish.create')
  create(@Body() createDishDto: CreateDishDto): IResponse<IDishDetail> {
    return this.dishService.create(createDishDto);
  }

  /**
   * Retrieves a list of all dishes.
   *
   * Authenticated users with 'dish.list' permission can retrieve a list of
   * all available dishes.
   *
   * @param searchDishDto - The query parameters for searching dishes.
   * @returns A list of dishes matching the search criteria.
   */
  @Get()
  @UseGuards(JwtGuard)
  @Permission('dish.list')
  findAll(
    @Query() searchDishDto: SearchDishDto,
  ): IResponse<IList<IDishDetail>> {
    return this.dishService.findAll(searchDishDto);
  }

  /**
   * Retrieves details of a specific dish.
   *
   * Authenticated users with 'dish.detail' permission can retrieve detailed
   * information about a specific dish by providing its ID.
   *
   * @param id - The ID of the dish to fetch details for.
   * @returns Details of the requested dish.
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  @Permission('dish.detail')
  findOne(@Param('id') id: string): IResponse<IDishDetail> {
    return this.dishService.findOne(id);
  }

  /**
   * Retrieve and serve an image associated with a dish.
   *
   * This route allows authenticated users with 'dish.list' and 'dish.detail'
   * permissions to retrieve an image associated with a specific dish by providing
   * the image's name. The image serves as a visual representation of the dish.
   *
   * @param name - The name of the image file associated with the dish.
   * @returns The image file corresponding to the provided name.
   *
   * @remarks
   * The images are typically stored and served from a designated location.
   * This function retrieves and serves the image content based on the provided
   * name, allowing clients to display the image within their applications.
   *
   * @example
   * // Request an image by providing its name in the route:
   * // GET /image/pasta.jpg
   *
   * @example
   * // Response with the requested image content.
   * // The image content is served based on the provided image name.
   */
  @Get('image/:name')
  @Permission('dish.list', 'dish.detail')
  loadImage(@Param('name') name: string, @Res() res: Response): void {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(
      fs.readFileSync(join(__dirname, '../..', 'images', name)),
      'binary',
    );
  }

  /**
   * Updates an existing dish.
   *
   * Authenticated users with 'dish.update' permission can update an existing
   * dish using the provided dish details and the dish's ID.
   *
   * @param id - The ID of the dish to be updated.
   * @param updateDishDto - The updated details of the dish.
   * @returns The updated dish.
   */
  @Put(':id')
  @UseGuards(JwtGuard)
  @Permission('dish.update')
  update(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
  ): IResponse<IDishDetail> {
    return this.dishService.update(id, updateDishDto);
  }

  /**
   * Deletes a dish.
   *
   * Authenticated users with 'dish.delete' permission can delete a dish by
   * providing its ID.
   *
   * @param id - The ID of the dish to be deleted.
   * @returns A message indicating successful deletion.
   */
  @Delete(':id')
  @UseGuards(JwtGuard)
  @Permission('dish.delete')
  remove(@Param('id') id: string): IResponse<Partial<IDishDetail>> {
    return this.dishService.remove(id);
  }

  /**
   * Updates the rating of a dish.
   *
   * Authenticated users with 'dish.rate' permission can update the rating of a
   * dish by providing its ID and the updated dish details containing the new rating.
   *
   * @param id - The ID of the dish to update the rating for.
   * @param rateDishDto - The updated dish details including the new rating.
   * @returns The updated dish with the new rating.
   */
  @Patch('rate/:id')
  @UseGuards(JwtGuard)
  @Permission('dish.rate')
  rate(
    @Req() req: Request & { user: Partial<IUserDetail> },
    @Param('id') id: string,
    @Body() rateDishDto: RateDishDto,
  ): IResponse<IDishDetail> {
    return this.dishService.rate(id, req?.user?.name, rateDishDto);
  }
}
