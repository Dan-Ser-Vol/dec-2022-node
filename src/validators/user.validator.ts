import Joi from "joi";

import { regexConstants } from "../constants";
import { EGenders } from "../enums/user.enum";

export class UserValidator {
  static userName = Joi.string().min(3).max(10).trim();
  static age = Joi.number().min(3).max(150);
  static gender = Joi.valid(...Object.values(EGenders)).messages({
    "any.only":
      "Неправильний gender. Стать має бути одним із дозволених значень, male або female",
  });

  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .required()
    .messages({
      "string.base": "Email повинен бути рядком.",
      "string.email": "Email повинен бути дійсною адресою електронної пошти.",
      "any.required": "Email є обов'язковим полем.",
    })
    .trim();
  static password = Joi.string()
    .regex(regexConstants.PASSWORD)
    .required()
    .messages({
      "string.base": "Пароль повинен бути рядком.",
      "any.required": "Пароль є обов'язковим полем.",
    })
    .trim();

  static create = Joi.object({
    name: this.userName.required(),
    age: this.age.required(),
    gender: this.gender.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static update = Joi.object({
    name: this.userName,
    age: this.age,
    gender: this.gender,
  });

  static login = Joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static changePassword = Joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
