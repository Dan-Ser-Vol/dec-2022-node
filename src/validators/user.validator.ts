import Joi from "joi";

import { regexConstants } from "../constants";
import { EGenders } from "../enums/user.enum";

export class UserValidator {
  static userName = Joi.string().min(3).max(10).trim();
  static age = Joi.number().min(3).max(150);
  static gender = Joi.valid(...Object.values(EGenders));
  static email = Joi.string()
    .regex(regexConstants.EMAIL)
    .lowercase()
    .required()
    .trim();
  static password = Joi.string()
    .regex(regexConstants.PASSWORD)
    .required()
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
}
