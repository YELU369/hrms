import { HttpException } from "./HttpException";

export class UnauthorizedException extends HttpException {
  
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}