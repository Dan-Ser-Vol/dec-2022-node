import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors";
import { userMapper } from "../mappers/user.mapper";
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

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { error, value } = UserValidator.update.validate(req.body);
      const { userId } = req.params;
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const updateUser = await userService.updateById(userId, value);
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
      const { userId } = req.params;
      await userService.deleteById(userId);
      return res.status(204).json({ message: "user deleted" });
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;
      const avatar = req.files.avatar as UploadedFile;
      const user = await userService.uploadAvatar(userId, avatar);
      const response = userMapper.toResponse(user);
      return res.status(201).json({ response, message: "avatar upload" });
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;
      const user = await userService.deleteAvatar(userId);
      const response = userMapper.toResponse(user);
      return res.status(201).json({ response, message: "avatar was deleted" });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
