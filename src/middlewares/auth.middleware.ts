import { NextFunction, Request, Response } from "express";

import { ETokenType } from "../enums/token-type.enum";
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

      await tokenService.checkToken(accessToken, ETokenType.ACCESS);

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
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.get("Authorization");
      if (!refreshToken) {
        next(new ApiError("No token!", 401));
      }

      const payload = tokenService.checkToken(refreshToken, ETokenType.REFRESH);

      const entity = await Token.findOne({ refreshToken });
      if (!entity) {
        next(new ApiError("No token!", 401));
      }

      req.res.locals.oldTokenPair = entity;
      req.res.locals.tokenPayload = { name: payload.name, _id: payload._id };
      next();
    } catch (err) {
      next(err);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
