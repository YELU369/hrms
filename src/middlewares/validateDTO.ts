import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const commonValidation = (dto : any) => {
  return (req : Request, res : Response, next : NextFunction) => {
    validate(plainToInstance(dto, req.body))
    .then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errMessage = {"error" : "Invalid data",
          "details" : errors.map( e => ({"field" : e.property, "details" : e.constraints}))
        }
        res.status(StatusCodes.BAD_REQUEST).json(errMessage);
      } 
      else {
        next();
      }
    })
  }
};