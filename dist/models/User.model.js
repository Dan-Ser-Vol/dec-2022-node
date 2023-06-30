"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../enums/user.enum");
const user_status_enum_1 = require("../enums/user-status.enum");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: user_enum_1.EGenders,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: { type: String, required: true },
    status: { type: String, default: user_status_enum_1.EUserStatus.Inactive, enum: user_status_enum_1.EUserStatus },
    activationToken: { type: String },
    avatar: { type: String, required: false },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("user", userSchema);
