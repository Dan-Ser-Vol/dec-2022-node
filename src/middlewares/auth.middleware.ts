import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const accessToken = req.get("Authorization");
      if (!accessToken) {
        next(new ApiError("No token!", 401));
      }

      await tokenService.checkToken(accessToken);

      const entity = await Token.findOne({ accessToken });
      if (!entity) {
        next(new ApiError("No token!", 401));
      }

      req.res.locals.token = entity;
      next();
    } catch (err) {
      next(err);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
