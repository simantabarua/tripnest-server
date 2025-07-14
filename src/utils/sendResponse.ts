import { Response } from "express";

interface TMeta {
  totalCount?: number;
}
interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}
export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(Number(data.statusCode)).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
