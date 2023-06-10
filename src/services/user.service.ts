import { User } from "../models/User.model";
import { IUser } from "../types/user.type";

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find().select("-password");
  }
  public async create(value: IUser): Promise<IUser> {
    return await User.create(value);
  }
  public async findById(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async updateById(id: string, value: IUser): Promise<IUser> {
    return await User.findOneAndUpdate(
      { _id: id },
      { ...value },
      { returnDocument: "after" }
    );
  }
  public async deleteById(id: string, data: any): Promise<void> {
    return await User.findOneAndDelete({ _id: id }, { ...data });
  }
}

export const userService = new UserService();
