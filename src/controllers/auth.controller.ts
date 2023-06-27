import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPair, ITokenPayload } from "../types/token.type";

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

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const oldTokenPair = req.res.locals.oldTokenPair as ITokenPair;

      const tokenPair = await authService.refresh(oldTokenPair, tokenPayload);
      return res.status(200).json(tokenPair);
    } catch (err) {
      next(err);
    }
  }

  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokenPair>> {
    try {
      const { _id: userId } = req.res.locals.payload as ITokenPayload;
      await authService.changePassword(req.body, userId);
      return res.status(201).json("password was changed");
    } catch (err) {
      next(err);
    }
  }

  public async activate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any>> {
    try {
      const { jwtPayload } = req.res.locals;
      await authService.activate(jwtPayload);
      return res.status(201).json("Your account is activated");
    } catch (err) {
      next(err);
    }
  }

  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const userId = res.locals.user._id;
      await authService.forgotPassword(userId, email);
      res.sendStatus(200).json("success");
    } catch (e) {}
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { password } = req.body;
      const { jwtPayload } = req.res.locals;
      await authService.setForgotPassword(
        password,
        jwtPayload._id,
        req.params.token
      );
      res.sendStatus(200).json("success");
    } catch (e) {}
  }
}

export const authController = new AuthController();
