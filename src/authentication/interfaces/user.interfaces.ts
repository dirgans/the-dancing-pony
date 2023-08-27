export interface IUserDetail extends IUserPermissions {
  id: string;
  name: string;
  nickname: string;
  password: string;
  age: number;
  isActive: boolean;
}

export interface IUserPermissions {
  permissions: string[];
}
