import { Permission } from './permission-metadata.constant';

describe('Permission Decorator', () => {
  it('filled permissions metadata', () => {
    const permissions = ['dish.detail', 'dish.rate'];

    const decorator = Permission(...permissions);

    const getMetadataSpy = jest
      .spyOn(Reflect, 'getMetadata')
      .mockReturnValue(permissions);

    const metadata = Reflect.getMetadata('permission', decorator);
    expect(metadata).toEqual(permissions);

    getMetadataSpy.mockRestore(); // Restore the original Reflect.getMetadata function
  });

  it('empty permissions metadata', () => {
    const decorator = Permission();

    const getMetadataSpy = jest
      .spyOn(Reflect, 'getMetadata')
      .mockReturnValue([]);

    const metadata = Reflect.getMetadata('permission', decorator);
    expect(metadata).toEqual([]);

    getMetadataSpy.mockRestore(); // Restore the original Reflect.getMetadata function
  });
});
