import { NextFunction, Request, Response } from "express";

import { EActionTokenTypes } from "../enums/action-token-type.enum";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
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

      const payload = await tokenService.checkToken(
        accessToken,
        ETokenType.ACCESS
      );

      const entity = await Token.findOne({ accessToken });
      if (!entity) {
        next(new ApiError("No token!", 401));
      }

      req.res.locals.payload = payload;
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

  public async checkIsActivated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const actionToken = req.params.token;
      if (!actionToken) {
        next(new ApiError("No activation Token!", 401));
      }

      const user = await User.findOne({ actionToken });
      if (!user) {
        next(new ApiError("This user no registration!", 401));
      }

      req.res.locals.user = user;
      next();
    } catch (err) {
      next(err);
    }
  }
  public checkActionToken(tokenType: EActionTokenTypes) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.params.token;
        if (!actionToken) {
          throw new ApiError("Token is not provided", 400);
        }

        const jwtPayload = tokenService.checkActionToken(
          actionToken,
          tokenType
        );

        const tokenFromDb = await Token.findOne({ actionToken });

        req.res.locals = { jwtPayload, tokenFromDb };
        next();
      } catch (err) {
        next(new ApiError(err.message, err.status));
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
