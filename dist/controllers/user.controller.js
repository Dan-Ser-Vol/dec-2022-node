"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const multer_1 = __importDefault(require("multer"));
const streamifier_1 = require("streamifier");
const errors_1 = require("../errors");
const user_mapper_1 = require("../mappers/user.mapper");
const s3_service_1 = require("../services/s3.service");
const user_service_1 = require("../services/user.service");
const user_validator_1 = require("../validators/user.validator");
class UserController {
    async findAll(req, res) {
        try {
            const users = await user_service_1.userService.findAllWithPagination(req.query);
            return res.json(users);
        }
        catch (err) {
            throw new errors_1.ApiError(err.message, 400);
        }
    }
    async findAllWithPagination(req, res, next) {
        try {
            const users = await user_service_1.userService.findAllWithPagination(req.query);
            return res.json(users);
        }
        catch (e) {
            next(e);
        }
    }
    async findById(req, res, next) {
        try {
            const user = await user_service_1.userService.findById(req.params.userId);
            return res.status(200).json({ user, message: "user founded" });
        }
        catch (e) {
            next(e);
        }
    }
    async updateById(req, res, next) {
        try {
            const { error, value } = user_validator_1.UserValidator.update.validate(req.body);
            const { userId } = req.params;
            if (error) {
                throw new errors_1.ApiError(error.message, 400);
            }
            const updateUser = await user_service_1.userService.updateById(userId, value);
            return res.status(200).json({ updateUser, message: "user updated" });
        }
        catch (e) {
            next(e);
        }
    }
    async deleteById(req, res, next) {
        try {
            const { userId } = req.params;
            await user_service_1.userService.deleteById(userId);
            return res.status(204).json({ message: "user deleted" });
        }
        catch (e) {
            next(e);
        }
    }
    async uploadAvatar(req, res, next) {
        try {
            const { userId } = req.params;
            const avatar = req.files.avatar;
            const user = await user_service_1.userService.uploadAvatar(userId, avatar);
            const response = user_mapper_1.userMapper.toResponse(user);
            return res.status(201).json({ response, message: "avatar upload" });
        }
        catch (e) {
            next(e);
        }
    }
    async deleteAvatar(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await user_service_1.userService.deleteAvatar(userId);
            const response = user_mapper_1.userMapper.toResponse(user);
            return res.status(201).json({ response, message: "avatar was deleted" });
        }
        catch (e) {
            next(e);
        }
    }
    async uploadVideo(req, res, next) {
        const { userId } = req.params;
        const upload = (0, multer_1.default)().single("");
        upload(req, res, async (err) => {
            if (err) {
                throw new errors_1.ApiError("Download error", 500);
            }
            const video = req.files.video;
            const stream = (0, streamifier_1.createReadStream)(video.data);
            const pathToVideo = await s3_service_1.s3Service.uploadFileStream(stream, video.mimetype, video.size, video, "video", userId);
            await user_service_1.userService.uploadVideo(userId, pathToVideo, video.name);
            return res
                .status(201)
                .json({ pathToVideo, message: "video was uploaded" });
        });
    }
    async findVideoById(req, res, next) {
        try {
            const { userId } = req.params;
            const video = await user_service_1.userService.findVideoById(userId);
            return res.status(200).json({ video });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.userController = new UserController();
