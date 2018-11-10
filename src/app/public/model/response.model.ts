export interface IResponse<T> {
  status: number;
  retcode: number;
  message: string;
  payload: any;
  timestamp: number;
}
