import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import { ApiError } from "../errors";

class CommonMiddleware {
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        throw new ApiError("Incorrect id", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
