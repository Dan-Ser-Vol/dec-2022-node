import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { ICredentials } from "../types/token.type";
import { IUser } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser) {
    try {
      const hashPassword = await passwordService.hash(data.password);
      return await User.create({ ...data, password: hashPassword });
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async login(credentials: ICredentials, user: IUser) {
    const watched = await passwordService.compare(
      credentials.password,
      user.password
    );

    if (!watched) {
      throw new ApiError("invalid email or password", 401);
    }

    const tokenPair = await tokenService.generateTokenPair({
      name: user.name,
      _id: user.id,
    });
    await Token.create({
      ...tokenPair,
      _userId: user._id,
    });
    return tokenPair;
  }
}

export const authService = new AuthService();
