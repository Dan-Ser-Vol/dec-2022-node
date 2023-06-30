"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants");
const user_enum_1 = require("../enums/user.enum");
class UserValidator {
}
exports.UserValidator = UserValidator;
_a = UserValidator;
UserValidator.userName = joi_1.default.string().min(3).max(10).trim();
UserValidator.age = joi_1.default.number().min(3).max(150);
UserValidator.gender = joi_1.default.valid(...Object.values(user_enum_1.EGenders)).messages({
    "any.only": "Неправильний gender. Стать має бути одним із дозволених значень, male або female",
});
UserValidator.email = joi_1.default.string()
    .regex(constants_1.regexConstants.EMAIL)
    .lowercase()
    .required()
    .messages({
    "string.base": "Email повинен бути рядком.",
    "string.email": "Email повинен бути дійсною адресою електронної пошти.",
    "any.required": "Email є обов'язковим полем.",
})
    .trim();
UserValidator.password = joi_1.default.string()
    .regex(constants_1.regexConstants.PASSWORD)
    .required()
    .messages({
    "string.base": "Пароль повинен бути рядком.",
    "any.required": "Пароль є обов'язковим полем.",
})
    .trim();
UserValidator.create = joi_1.default.object({
    name: _a.userName.required(),
    age: _a.age.required(),
    gender: _a.gender.required(),
    email: _a.email.required(),
    password: _a.password.required(),
});
UserValidator.update = joi_1.default.object({
    name: _a.userName,
    age: _a.age,
    gender: _a.gender,
});
UserValidator.login = joi_1.default.object({
    email: _a.email.required(),
    password: _a.password.required(),
});
UserValidator.changePassword = joi_1.default.object({
    oldPassword: _a.password.required(),
    newPassword: _a.password.required(),
});
UserValidator.forgotPassword = joi_1.default.object({
    email: _a.email.required(),
});
UserValidator.setForgotPassword = joi_1.default.object({
    password: _a.password.required(),
});
