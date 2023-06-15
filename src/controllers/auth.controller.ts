import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPair } from "../types/token.type";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.register(req.body);
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const user = req.res.locals.user;

      const tokenPair = await authService.login(req.body, user);
      return res.status(200).json({ ...tokenPair });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
