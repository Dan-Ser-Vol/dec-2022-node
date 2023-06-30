"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.configs = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT || 5001,
    SECRET_SALT: process.env.SECRET_SALT,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,
    JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET,
    NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
    NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,
    FRONT_URL: process.env.FRONT_URL,
    API_URL: process.env.API_URL,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_NAME: process.env.AWS_S3_NAME,
    AWS_S3_ACL: process.env.AWS_S3_ACL,
    AWS_S3_URL: process.env.AWS_S3_URL,
};
