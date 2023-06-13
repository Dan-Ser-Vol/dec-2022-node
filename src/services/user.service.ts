import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  public async create(value: IUser): Promise<IUser> {
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      throw new ApiError("Такий користувач вже існує", 409);
    }
    return await User.create(value);
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

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }
}

export const userService = new UserService();
