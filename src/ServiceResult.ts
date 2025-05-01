export class ServiceResult {
  public code: number;
  public success: boolean;
  public message: string;
  public data: any;

  constructor(message: string, code: number, data: any, success: boolean) {
    this.message = message;
    this.code = code;
    this.data = data;
    this.success = success;
  }

  static success(message: string, code: number = 200, data: any = null, success: boolean = true) {
    return new ServiceResult(message, code, data, success); 
  }

  static error(message: string, code: number = 500, data: any = null, success: boolean = false) {
    return new ServiceResult(message, code, data, success); 
  }
}