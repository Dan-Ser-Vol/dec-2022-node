"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const errors_1 = require("../errors");
const User_model_1 = require("../models/User.model");
class UserService {
    async findAll() {
        return await User_model_1.User.find();
    }
    async findById(id) {
        return await this.getOneByIdOrThrow(id);
    }
    async updateById(id, value) {
        await this.getOneByIdOrThrow(id);
        return await User_model_1.User.findOneAndUpdate({ _id: id }, { ...value }, { returnDocument: "after" });
    }
    async deleteById(id) {
        await this.getOneByIdOrThrow(id);
        return await User_model_1.User.findOneAndDelete({ _id: id });
    }
    async getOneByIdOrThrow(userId) {
        const user = await User_model_1.User.findById(userId);
        if (!user) {
            throw new errors_1.ApiError("User not found", 422);
        }
        return user;
    }
}
exports.userService = new UserService();
