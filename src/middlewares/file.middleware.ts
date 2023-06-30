import { NextFunction, Request, Response } from "express";

import { avatarConfig } from "../configs/imageConfig";
import { ApiError } from "../errors";

class FileMiddleware {
  public isAvatarValid(req: Request, res: Response, next: NextFunction) {
    console.log(req.files);
    try {
      if (Array.isArray(req.files.avatar)) {
        throw new ApiError("Avatar must be only one image", 400);
      }

      const { mimetype, size } = req.files.avatar;
      if (!avatarConfig.MIME_TYPE.includes(mimetype)) {
        throw new ApiError("Avatar has invalid format", 400);
      }

      if (avatarConfig.MAX_SIZE < size) {
        throw new ApiError("Too big a size image, must be max 2 mb", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const fileMiddleware = new FileMiddleware();
