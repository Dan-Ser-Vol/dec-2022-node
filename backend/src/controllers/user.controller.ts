import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
  public async findAll(
    req: Request,
    res: Response
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();
      return res.json(users);
    } catch (err) {
      throw new ApiError(err.message, 400);
    }
  }

  public async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = await userService.findById(req.params.userId);
      return res.status(200).json({ user, message: "user founded" });
    } catch (e) {
      next(e);
    }
  }

  // public async updateById(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response<IUser>> {
  //   try {
  //     const updateUser = await userService.updateById(userId, req.body);
  //     return res.status(200).json({ updateUser, message: "user updated" });
  //   } catch (e) {
  //     next(e);
  //   }
  // }
  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;
      await userService.deleteById(userId);
      return res.status(204).json({ message: "user deleted" });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();