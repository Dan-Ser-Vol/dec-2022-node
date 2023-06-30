"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../configs/config");
class PasswordService {
    async hash(password) {
        return await bcrypt_1.default.hash(password, +config_1.configs.SECRET_SALT);
    }
    async compare(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.passwordService = new PasswordService();
