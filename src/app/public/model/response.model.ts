export interface IResponse<T> {
  code: string;
  msg: string;
  data: T;
}
