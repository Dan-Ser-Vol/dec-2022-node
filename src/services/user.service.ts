import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { Video } from "../models/Video.model";
import { IUser } from "../types/user.type";
import { IVideo } from "../types/video.type";
import { s3Service } from "./s3.service";

export interface IQuery {
  page: string;
  limit: string;
  sortedBy: string;

  [key: string]: string;
}

export interface IPaginationResponse<T> {
  page: number;
  perPage: number;
  itemsCount: number;
  itemsFound: number;
  data: T[];
}

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async findAllWithPagination(
    query: IQuery
  ): Promise<IPaginationResponse<IUser>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`)
      );
      const {
        page = 1,
        limit = 10,
        sortedBy = "createdAt",
        ...searchObj
      } = queryObj;
      const skip = +limit * (+page - 1);

      const [usersTotalCount, usersSearchCount, users] = await Promise.all([
        await User.count(),
        await User.count(searchObj),
        await User.find(searchObj).limit(+limit).skip(skip).sort(sortedBy),
      ]);

      return {
        page: +page,
        perPage: +limit,
        itemsCount: usersTotalCount,
        itemsFound: usersSearchCount,
        data: users,
      };
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(id);
  }

  public async updateById(id: string, value: IUser): Promise<IUser> {
    await this.getOneByIdOrThrow(id);
    return await User.findOneAndUpdate(
      { _id: id },
      { ...value },
      { returnDocument: "after" }
    );
  }

  public async deleteById(id: string): Promise<void> {
    await this.getOneByIdOrThrow(id);
    return await User.findOneAndDelete({ _id: id });
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile
  ): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    const avatarPath = await s3Service.uploadFile(avatar, "user", userId);
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { avatar: avatarPath },
      },
      { new: true }
    );
  }

  public async deleteAvatar(userId: string): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (!user.avatar) {
      return user;
    }
    await s3Service.deleteFile(user.avatar);
    return await User.findByIdAndUpdate(
      userId,
      { $unset: { avatar: true } },
      { new: true }
    );
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }

  public async uploadVideo(userId: string, path: string, name: string) {
    await Video.create({ _userId: userId, name, path });
  }

  public async findVideoById(userId: string): Promise<IVideo> {
    return await Video.findOne({ _userId: userId });
  }
}

export const userService = new UserService();
