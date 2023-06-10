import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";
import { UserValidator } from "../validators/user.validator";

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

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = await userService.create(req.res.locals as IUser);
      return res.status(201).json({ user, message: "user created" });
    } catch (e) {
      next(e);
    }
  }
  public async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = await userService.findById(req.params.id);
      return res.status(200).json({ user, message: "user founded" });
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { error, value } = UserValidator.update.validate(req.body);
      const { id } = req.params;
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const updateUser = await userService.updateById(id, value);
      return res.status(200).json({ updateUser, message: "user updated" });
    } catch (e) {
      next(e);
    }
  }
  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { id } = req.params;
      await userService.deleteById(id, req.body);
      return res.status(200).json({ message: "user deleted" });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
