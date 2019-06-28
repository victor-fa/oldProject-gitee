export interface IResponse<T> {
  count?: number;
  status: number;
  retcode: number;
  message: string;
  payload: any;
  timestamp: number;
}
