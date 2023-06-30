"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            await auth_service_1.authService.register(req.body);
            res.sendStatus(201);
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const user = req.res.locals.user;
            const tokenPair = await auth_service_1.authService.login(req.body, user);
            return res.status(200).json({ ...tokenPair });
        }
        catch (err) {
            next(err);
        }
    }
    async refresh(req, res, next) {
        try {
            const tokenPayload = req.res.locals.tokenPayload;
            const oldTokenPair = req.res.locals.oldTokenPair;
            const tokenPair = await auth_service_1.authService.refresh(oldTokenPair, tokenPayload);
            return res.status(200).json(tokenPair);
        }
        catch (err) {
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { _id: userId } = req.res.locals.payload;
            await auth_service_1.authService.changePassword(req.body, userId);
            return res.status(201).json("password was changed");
        }
        catch (err) {
            next(err);
        }
    }
    async activate(req, res, next) {
        try {
            const { jwtPayload } = req.res.locals;
            await auth_service_1.authService.activate(jwtPayload);
            return res.status(201).json("Your account is activated");
        }
        catch (err) {
            next(err);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const userId = res.locals.user._id;
            await auth_service_1.authService.forgotPassword(userId, email);
            res.sendStatus(200).json("success");
        }
        catch (e) { }
    }
    async setForgotPassword(req, res, next) {
        try {
            const { password } = req.body;
            const { jwtPayload } = req.res.locals;
            await auth_service_1.authService.setForgotPassword(password, jwtPayload._id, req.params.token);
            res.sendStatus(200).json("success");
        }
        catch (e) { }
    }
}
exports.authController = new AuthController();
