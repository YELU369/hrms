import { HttpException } from "./HttpException";

export class NotFoundException extends HttpException {
  
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}