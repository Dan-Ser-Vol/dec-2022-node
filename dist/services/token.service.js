"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const action_token_type_enum_1 = require("../enums/action-token-type.enum");
const token_type_enum_1 = require("../enums/token-type.enum");
const errors_1 = require("../errors");
class TokenService {
    generateTokenPair(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.configs.JWT_ACCESS_SECRET, {
            expiresIn: "10h",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.configs.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });
        return { accessToken, refreshToken };
    }
    generateActionToken(payload, tokenType) {
        try {
            let secret;
            switch (tokenType) {
                case action_token_type_enum_1.EActionTokenTypes.Forgot:
                    secret = config_1.configs.JWT_FORGOT_SECRET;
                    break;
                case action_token_type_enum_1.EActionTokenTypes.Activate:
                    secret = config_1.configs.JWT_ACTIVATE_SECRET;
                    break;
            }
            return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
        }
        catch (err) {
            throw new errors_1.ApiError(err.message, err.status);
        }
    }
    checkToken(token, type) {
        try {
            let secret;
            switch (type) {
                case token_type_enum_1.ETokenType.ACCESS:
                    secret = config_1.configs.JWT_ACCESS_SECRET;
                    break;
                case token_type_enum_1.ETokenType.REFRESH:
                    secret = config_1.configs.JWT_REFRESH_SECRET;
                    break;
            }
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            throw new errors_1.ApiError("Token check not valid", 401);
        }
    }
    checkActionToken(token, tokenType) {
        try {
            let secret;
            switch (tokenType) {
                case action_token_type_enum_1.EActionTokenTypes.Forgot:
                    secret = config_1.configs.JWT_FORGOT_SECRET;
                    break;
                case action_token_type_enum_1.EActionTokenTypes.Activate:
                    secret = config_1.configs.JWT_ACTIVATE_SECRET;
                    break;
            }
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            throw new errors_1.ApiError("Token check not valid", 401);
        }
    }
}
exports.tokenService = new TokenService();
