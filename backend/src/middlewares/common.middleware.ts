import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isValidObjectId } from "mongoose";

import { ApiError } from "../errors";

class CommonMiddleware {
  public isIdValid(field: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[field];
        if (!isValidObjectId(id)) {
          return next(new ApiError("Incorrect id", 400));
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);
        if (error) {
          return next(new ApiError(error.message, 400));
        }
        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
