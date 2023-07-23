import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

class UserMiddleware {
  public findOneOrThrow(field: keyof IUser) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });
        if (user) {
          throw new ApiError("User with this email already exist", 409);
        }
        req.res.locals.user = user;
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  public async isUserExist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        next(new ApiError("User not found", 422));
      }
      req.res.locals.user = user;
      next();
    } catch (err) {
      next(err);
    }
  }
}

export const userMiddleware = new UserMiddleware();
