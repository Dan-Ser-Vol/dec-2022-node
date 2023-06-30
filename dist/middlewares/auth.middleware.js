"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_type_enum_1 = require("../enums/token-type.enum");
const errors_1 = require("../errors");
const Token_model_1 = require("../models/Token.model");
const User_model_1 = require("../models/User.model");
const token_service_1 = require("../services/token.service");
class AuthMiddleware {
    async checkAccessToken(req, res, next) {
        try {
            const accessToken = req.get("Authorization");
            if (!accessToken) {
                next(new errors_1.ApiError("No token!", 401));
            }
            const payload = await token_service_1.tokenService.checkToken(accessToken, token_type_enum_1.ETokenType.ACCESS);
            const entity = await Token_model_1.Token.findOne({ accessToken });
            if (!entity) {
                next(new errors_1.ApiError("No token!", 401));
            }
            req.res.locals.payload = payload;
            next();
        }
        catch (err) {
            next(err);
        }
    }
    async checkRefreshToken(req, res, next) {
        try {
            const refreshToken = req.get("Authorization");
            if (!refreshToken) {
                next(new errors_1.ApiError("No token!", 401));
            }
            const payload = token_service_1.tokenService.checkToken(refreshToken, token_type_enum_1.ETokenType.REFRESH);
            const entity = await Token_model_1.Token.findOne({ refreshToken });
            if (!entity) {
                next(new errors_1.ApiError("No token!", 401));
            }
            req.res.locals.oldTokenPair = entity;
            req.res.locals.tokenPayload = { name: payload.name, _id: payload._id };
            next();
        }
        catch (err) {
            next(err);
        }
    }
    async checkIsActivated(req, res, next) {
        try {
            const actionToken = req.params.token;
            if (!actionToken) {
                next(new errors_1.ApiError("No activation Token!", 401));
            }
            const user = await User_model_1.User.findOne({ actionToken });
            if (!user) {
                next(new errors_1.ApiError("This user no registration!", 401));
            }
            req.res.locals.user = user;
            next();
        }
        catch (err) {
            next(err);
        }
    }
    checkActionToken(tokenType) {
        return async (req, res, next) => {
            try {
                const actionToken = req.params.token;
                if (!actionToken) {
                    throw new errors_1.ApiError("Token is not provided", 400);
                }
                const jwtPayload = token_service_1.tokenService.checkActionToken(actionToken, tokenType);
                const tokenFromDb = await Token_model_1.Token.findOne({ actionToken });
                req.res.locals = { jwtPayload, tokenFromDb };
                next();
            }
            catch (err) {
                next(new errors_1.ApiError(err.message, err.status));
            }
        };
    }
}
exports.authMiddleware = new AuthMiddleware();
