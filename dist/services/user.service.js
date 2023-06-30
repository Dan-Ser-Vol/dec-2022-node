"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const errors_1 = require("../errors");
const User_model_1 = require("../models/User.model");
const s3_service_1 = require("./s3.service");
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
    async uploadAvatar(userId, avatar) {
        const user = await this.getOneByIdOrThrow(userId);
        if (user.avatar) {
            await s3_service_1.s3Service.deleteFile(user.avatar);
        }
        const avatarPath = await s3_service_1.s3Service.uploadFile(avatar, "user", userId);
        return await User_model_1.User.findByIdAndUpdate(userId, {
            $set: { avatar: avatarPath },
        }, { new: true });
    }
    async deleteAvatar(userId) {
        const user = await this.getOneByIdOrThrow(userId);
        if (!user.avatar) {
            return user;
        }
        await s3_service_1.s3Service.deleteFile(user.avatar);
        return await User_model_1.User.findByIdAndUpdate(userId, { $unset: { avatar: "" } }, { new: true });
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
