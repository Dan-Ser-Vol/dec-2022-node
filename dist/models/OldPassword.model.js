"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldPassword = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const oldPassword = new mongoose_1.Schema({
    password: { type: String, required: true },
    _userId: { type: mongoose_1.Types.ObjectId, required: true, ref: User_model_1.User },
}, { timestamps: true, versionKey: false });
exports.OldPassword = (0, mongoose_1.model)("OldPassword", oldPassword);
