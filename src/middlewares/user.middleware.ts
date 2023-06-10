import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { UserValidator } from "../validators/user.validator";

class UserMiddleware {
  public isCreateValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserValidator.create.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      req.res.locals = value;
      next();
    } catch (e) {
      next(e);
    }
  }

  // public async isMongoIdValid() {}
}

export const userMiddleware = new UserMiddleware();
