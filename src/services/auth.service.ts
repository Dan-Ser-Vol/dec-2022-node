import { Types } from "mongoose";

import { EActionTokenTypes } from "../enums/action-token-type.enum";
import { EEmailActions } from "../enums/email.enum";
import { ESmsActions } from "../enums/sms.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { ApiError } from "../errors";
import { Action } from "../models/ActionToken.model";
import { OldPassword } from "../models/OldPassword.model";
import { Token } from "../models/Token.model";
import { User } from "../models/User.model";
import { ICredentials, ITokenPair, ITokenPayload } from "../types/token.type";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { smsService } from "./sms.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser) {
    try {
      const hashPassword = await passwordService.hash(data.password);
      const user = await User.create({ ...data, password: hashPassword });
      const actionToken = tokenService.generateActionToken(
        { _id: user._id },
        EActionTokenTypes.Activate
      );
      await Promise.all([
        Action.create({
          actionToken,
          tokenType: EActionTokenTypes.Activate,
          _userId: user._id,
        }),
        emailService.sendMail(data.email, EEmailActions.ACTIVATED, {
          name: data.name,
          actionToken,
        }),

        smsService.sendSms(data.phone, ESmsActions.ACTIVATED),
      ]);
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

  public async activate(payload: ITokenPayload): Promise<void> {
    await Promise.all([
      User.updateOne({ _id: payload._id }, { status: EUserStatus.Active }),
      Action.deleteMany({
        _userId: payload._id,
        tokenType: EActionTokenTypes.Activate,
      }),
    ]);
  }

  public async changePassword(
    dto: { newPassword: string; oldPassword: string },
    userId: string
  ): Promise<void> {
    try {
      const oldPasswords = await OldPassword.find({ _userId: userId });
      oldPasswords.map(async ({ password: hash }) => {
        const isMatched = await passwordService.compare(dto.newPassword, hash);
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
        throw new ApiError(
          "old password is wrong, please enter another password",
          404
        );
      }
      const newHash = await passwordService.hash(dto.newPassword);
      await Promise.all([
        await OldPassword.create({ password: user.password, _userId: userId }),
        await User.updateOne({ _id: userId }, { password: newHash }),
      ]);
    } catch (err) {
      throw new ApiError(err.mesage, err.status);
    }
  }

  public async forgotPassword(
    userId: Types.ObjectId,
    email: string
  ): Promise<void> {
    try {
      const actionToken = tokenService.generateActionToken(
        { _id: userId },
        EActionTokenTypes.Forgot
      );

      await Promise.all([
        await Action.create({
          actionToken,
          tokenType: EActionTokenTypes.Forgot,
          _userId: userId,
        }),

        await emailService.sendMail(email, EEmailActions.FORGOT_PASSWORD, {
          actionToken,
        }),
      ]);
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }

  public async setForgotPassword(
    password: string,
    userId: Types.ObjectId,
    actionToken: string
  ): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(password);
      await Promise.all([
        User.updateOne({ _id: userId }, { password: hashedPassword }),
        Action.deleteOne({ actionToken }),
      ]);
    } catch (err) {
      throw new ApiError(err.message, err.status);
    }
  }
}

export const authService = new AuthService();
