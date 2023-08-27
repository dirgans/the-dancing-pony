export type TResponseStatus = 'Failed' | 'Success';

export interface IResponse<T> {
  status: TResponseStatus;
  message: string;
  data?: T | T[];
}
