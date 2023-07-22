import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import multer from "multer";
import { createReadStream } from "streamifier";

import { ApiError } from "../errors";
import { userMapper } from "../mappers/user.mapper";
import { s3Service } from "../services/s3.service";
import { IQuery, userService } from "../services/user.service";
import { IUser } from "../types/user.type";
import { UserValidator } from "../validators/user.validator";

class UserController {
  public async findAll(
    req: Request,
    res: Response
  ): Promise<Response<IUser[]>> {
    try {
      // const users = await userService.findAll();
      const users = await userService.findAllWithPagination(
        req.query as unknown as IQuery
      );
      return res.json(users);
    } catch (err) {
      throw new ApiError(err.message, 400);
    }
  }

  public async findAllWithPagination(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAllWithPagination(
        req.query as unknown as IQuery
      );
      return res.json(users);
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

  public async uploadVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { userId } = req.params;

    const upload = multer().single("");
    upload(req, res, async (err) => {
      if (err) {
        throw new ApiError("Download error", 500);
      }
      const video = req.files.video as UploadedFile;
      const stream = createReadStream(video.data);
      const pathToVideo = await s3Service.uploadFileStream(
        stream,
        video.mimetype,
        video.size,
        video,
        "video",
        userId
      );
      await userService.uploadVideo(userId, pathToVideo, video.name);
      return res
        .status(201)
        .json({ pathToVideo, message: "video was uploaded" });
    });
  }

  public async findVideoById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { userId } = req.params;
      const video = await userService.findVideoById(userId);
      return res.status(200).json({ video });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
