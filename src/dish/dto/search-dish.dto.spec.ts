import { SearchDishDto } from './search-dish.dto';
import { instanceToPlain } from 'class-transformer';

describe('SearchDishDto', () => {
  it('transform limit', () => {
    const searchDishDto = new SearchDishDto();
    searchDishDto.limit = '20' as any;

    const plainDto = instanceToPlain(searchDishDto);

    expect(plainDto.limit).toEqual(20);
  });

  it('transform limit', () => {
    const searchDishDto = new SearchDishDto();
    searchDishDto.limit = null as any;

    const plainDto = instanceToPlain(searchDishDto);

    expect(plainDto.limit).toEqual(20);
  });

  it('transform page', () => {
    const searchDishDto = new SearchDishDto();
    searchDishDto.page = '3' as any;

    const plainDto = instanceToPlain(searchDishDto);

    expect(plainDto.page).toEqual(3);
  });

  it('transform page', () => {
    const searchDishDto = new SearchDishDto();
    searchDishDto.page = null as any;

    const plainDto = instanceToPlain(searchDishDto);

    expect(plainDto.page).toEqual(3);
  });
});
