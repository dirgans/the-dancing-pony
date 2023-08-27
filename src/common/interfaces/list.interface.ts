export interface IPagination {
  page: number;
  total: number;
  size: number;
  rows_per_page: number;
}

export interface IList<T> {
  content: T[];
  pagination: IPagination;
}
