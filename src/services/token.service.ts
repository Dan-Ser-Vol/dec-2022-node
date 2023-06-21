import jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import { IActionToken, ITokenPair, ITokenPayload } from "../types/token.type";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "10s",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  public generateActionToken(payload: IActionToken): string {
    return jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "10m",
    });
  }

  public checkToken(token: string, type: ETokenType): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case ETokenType.ACCESS:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.REFRESH:
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (err) {
      throw new ApiError("Token check not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
