"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMiddleware = void 0;
const mongoose_1 = require("mongoose");
const errors_1 = require("../errors");
class CommonMiddleware {
    isIdValid(field) {
        return (req, res, next) => {
            try {
                const id = req.params[field];
                if (!(0, mongoose_1.isValidObjectId)(id)) {
                    return next(new errors_1.ApiError("Incorrect id", 400));
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    isBodyValid(validator) {
        return (req, res, next) => {
            try {
                const { error, value } = validator.validate(req.body);
                if (error) {
                    return next(new errors_1.ApiError(error.message, 400));
                }
                req.body = value;
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
}
exports.commonMiddleware = new CommonMiddleware();
