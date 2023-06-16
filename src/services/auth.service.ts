import { EEmailActions } from "../enums/email.enum";
import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { ICredentials, ITokenPair, ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser) {
    try {
      const hashPassword = await passwordService.hash(data.password);
      await User.create({ ...data, password: hashPassword });
      await emailService.sendMail(data.email, EEmailActions.REGISTER, {
        name: data.name,
      });
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async login(credentials: ICredentials, user: IUser) {
    const isMatched = await passwordService.compare(
      credentials.password,
      user.password
    );

    if (!isMatched) {
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

  public async refresh(oldTokenPair: ITokenPair, tokenPayload: ITokenPayload) {
    const tokenPair = await tokenService.generateTokenPair(tokenPayload);
    await Promise.all([
      Token.create({ _userId: tokenPayload._id, ...tokenPair }),
      Token.deleteOne({ refreshToken: oldTokenPair.refreshToken }),
    ]);

    return tokenPair;
  }
}

export const authService = new AuthService();
