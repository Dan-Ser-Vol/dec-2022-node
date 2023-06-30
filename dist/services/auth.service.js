"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const action_token_type_enum_1 = require("../enums/action-token-type.enum");
const email_enum_1 = require("../enums/email.enum");
const user_status_enum_1 = require("../enums/user-status.enum");
const errors_1 = require("../errors");
const ActionToken_model_1 = require("../models/ActionToken.model");
const OldPassword_model_1 = require("../models/OldPassword.model");
const Token_model_1 = require("../models/Token.model");
const User_model_1 = require("../models/User.model");
const email_service_1 = require("./email.service");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
class AuthService {
    async register(data) {
        try {
            const hashPassword = await password_service_1.passwordService.hash(data.password);
            const user = await User_model_1.User.create({ ...data, password: hashPassword });
            const actionToken = token_service_1.tokenService.generateActionToken({ _id: user._id }, action_token_type_enum_1.EActionTokenTypes.Activate);
            await Promise.all([
                ActionToken_model_1.Action.create({
                    actionToken,
                    tokenType: action_token_type_enum_1.EActionTokenTypes.Activate,
                    _userId: user._id,
                }),
                email_service_1.emailService.sendMail(data.email, email_enum_1.EEmailActions.ACTIVATED, {
                    name: data.name,
                    actionToken,
                }),
            ]);
        }
        catch (err) {
            throw new errors_1.ApiError(err.message, err.status);
        }
    }
    async login(credentials, user) {
        const isMatched = await password_service_1.passwordService.compare(credentials.password, user.password);
        if (!isMatched) {
            throw new errors_1.ApiError("invalid email or password", 401);
        }
        const tokenPair = await token_service_1.tokenService.generateTokenPair({
            name: user.name,
            _id: user.id,
        });
        await Token_model_1.Token.create({
            ...tokenPair,
            _userId: user._id,
        });
        return tokenPair;
    }
    async refresh(oldTokenPair, tokenPayload) {
        const tokenPair = await token_service_1.tokenService.generateTokenPair(tokenPayload);
        await Promise.all([
            Token_model_1.Token.create({ _userId: tokenPayload._id, ...tokenPair }),
            Token_model_1.Token.deleteOne({ refreshToken: oldTokenPair.refreshToken }),
        ]);
        return tokenPair;
    }
    async activate(payload) {
        await Promise.all([
            User_model_1.User.updateOne({ _id: payload._id }, { status: user_status_enum_1.EUserStatus.Active }),
            ActionToken_model_1.Action.deleteMany({
                _userId: payload._id,
                tokenType: action_token_type_enum_1.EActionTokenTypes.Activate,
            }),
        ]);
    }
    async changePassword(dto, userId) {
        try {
            const oldPasswords = await OldPassword_model_1.OldPassword.find({ _userId: userId });
            oldPasswords.map(async ({ password: hash }) => {
                const isMatched = await password_service_1.passwordService.compare(dto.newPassword, hash);
                if (isMatched) {
                    throw new errors_1.ApiError("Wrong old password", 400);
                }
            });
            const user = await User_model_1.User.findById(userId).select("password");
            const isMatched = await password_service_1.passwordService.compare(dto.oldPassword, user.password);
            if (!isMatched) {
                throw new errors_1.ApiError("old password is wrong, please enter another password", 404);
            }
            const newHash = await password_service_1.passwordService.hash(dto.newPassword);
            await Promise.all([
                await OldPassword_model_1.OldPassword.create({ password: user.password, _userId: userId }),
                await User_model_1.User.updateOne({ _id: userId }, { password: newHash }),
            ]);
        }
        catch (err) {
            throw new errors_1.ApiError(err.mesage, err.status);
        }
    }
    async forgotPassword(userId, email) {
        try {
            const actionToken = token_service_1.tokenService.generateActionToken({ _id: userId }, action_token_type_enum_1.EActionTokenTypes.Forgot);
            await Promise.all([
                await ActionToken_model_1.Action.create({
                    actionToken,
                    tokenType: action_token_type_enum_1.EActionTokenTypes.Forgot,
                    _userId: userId,
                }),
                await email_service_1.emailService.sendMail(email, email_enum_1.EEmailActions.FORGOT_PASSWORD, {
                    actionToken,
                }),
            ]);
        }
        catch (err) {
            throw new errors_1.ApiError(err.message, err.status);
        }
    }
    async setForgotPassword(password, userId, actionToken) {
        try {
            const hashedPassword = await password_service_1.passwordService.hash(password);
            await Promise.all([
                User_model_1.User.updateOne({ _id: userId }, { password: hashedPassword }),
                ActionToken_model_1.Action.deleteOne({ actionToken }),
            ]);
        }
        catch (err) {
            throw new errors_1.ApiError(err.message, err.status);
        }
    }
}
exports.authService = new AuthService();
