import { BadRequestException } from "@/exceptions/BadRequestException";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const commonValidation = (DtoClass: any) => {
  
  return async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body) {
        throw new BadRequestException('Payload is not provided!');
      }

      const dtoInstance = plainToInstance(DtoClass, request.body, {
        enableImplicitConversion: true,
      });

      const errors: ValidationError[] = await validate(dtoInstance, { whitelist: true });

      if (errors.length > 0) {

        const formattedErrors = {
          error: 'Invalid data',
          details: errors.map((e) => ({
            field: e.property,
            details: e.constraints,
          })),
        };

        response.status(400).json(formattedErrors);
      }

      next();

    } catch (exception) {
      
      console.error('Validation middleware error:', exception);
      throw exception;
    }
  };
};
