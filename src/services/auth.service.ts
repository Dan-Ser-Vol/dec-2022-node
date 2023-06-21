import { configs } from "../configs/config";
import { EEmailActions } from "../enums/email.enum";
import { ApiError } from "../errors";
import { OldPassword } from "../models/OldPassword.model";
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
      const { email, password } = data;
      const hashPassword = await passwordService.hash(data.password);
      const user = await User.create({ ...data, password: hashPassword });
      const actionToken = tokenService.generateActionToken({ email, password });
      const activationLink = `${configs.API_URL}/auth/activate/${actionToken}`;
      await user.updateOne({ activationLink: actionToken });
      await emailService.sendMail(data.email, EEmailActions.ACTIVATED, {
        name: data.name,
        link: activationLink,
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

  public async activate(activationLink: string): Promise<any> {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw new ApiError("Invalid activation link", 404);
    }
    user.isActivated = true;
    await user.save();
  }

  public async changePassword(
    dto: { newPassword: string; oldPassword: string },
    userId: string
  ): Promise<void> {
    try {
      const oldPasswords = await OldPassword.find({ _userId: userId });
      oldPasswords.map(async ({ password: hash }) => {
        const isMatched = await passwordService.compare(dto.oldPassword, hash);
        if (isMatched) {
          throw new ApiError("Wrong old password", 400);
        }
      });

      const user = await User.findById(userId).select("password");
      const isMatched = await passwordService.compare(
        dto.oldPassword,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("old password is wrong", 404);
      }
      const newHash = await passwordService.hash(dto.oldPassword);
      await Promise.all([
        await OldPassword.create({ password: user.password, _userId: userId }),
        await User.updateOne({ _id: userId }, { password: newHash }),
      ]);
    } catch (err) {
      throw new ApiError(err.mesage, err.status);
    }
  }
}

export const authService = new AuthService();
