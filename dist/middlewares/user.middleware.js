"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const errors_1 = require("../errors");
const User_model_1 = require("../models/User.model");
class UserMiddleware {
    findOneOrThrow(field) {
        return async (req, res, next) => {
            try {
                const user = await User_model_1.User.findOne({ [field]: req.body[field] });
                if (user) {
                    throw new errors_1.ApiError("User with this email already exist", 409);
                }
                req.res.locals.user = user;
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
    isUserExist(field) {
        return async (req, res, next) => {
            try {
                const user = await User_model_1.User.findOne({ [field]: req.body[field] }).select("password");
                if (!user) {
                    next(new errors_1.ApiError("User not found", 422));
                }
                req.res.locals.user = user;
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.userMiddleware = new UserMiddleware();
