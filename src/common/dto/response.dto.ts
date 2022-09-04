// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse{
  constructor (infoMessage:string, data?: any, status?:number,) {
    this.status = status;
    this.message = infoMessage;
    this.data = data;
    // console.warn(new Date().toString() + ' - [Response]: ' + infoMessage + (data ? ' - ' + JSON.stringify(data): ''));
  };
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  status: number;
}

export class ResponseSuccess implements IResponse{
  constructor (infoMessage:string = '请求成功', data?: any, notLog?: boolean) {
    this.status = 200;
    this.message = infoMessage;
    this.data = data;
    if(!notLog) {
      try {
        var offuscateRequest = JSON.parse(JSON.stringify(data));
        if(offuscateRequest && offuscateRequest.token) offuscateRequest.token = "*******";
        // console.log(new Date().toString() + ' - [Response]: ' + JSON.stringify(offuscateRequest))
      } catch(error){}
    };
  };
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  status: number;
}