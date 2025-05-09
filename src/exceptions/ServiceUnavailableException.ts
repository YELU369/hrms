import { HttpException } from "./HttpException";

export class ServiceUnavailableException extends HttpException {
  
  constructor(message = 'Service Unavailable') {
    super(message, 503);
  }
}