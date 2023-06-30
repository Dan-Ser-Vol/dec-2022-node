"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOldTokens = void 0;
const cron_1 = require("cron");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const Token_model_1 = require("../models/Token.model");
const User_model_1 = require("../models/User.model");
dayjs_1.default.extend(utc_1.default);
const tokensRemover = async () => {
    const previousDate = (0, dayjs_1.default)().utc().subtract(1, "minutes");
    console.log("some time");
    const users = await User_model_1.User.find();
    users.map(async (user) => {
        await Token_model_1.Token.deleteMany({
            _userId: user._id,
            createdAt: { $lte: previousDate },
        });
    });
};
exports.removeOldTokens = new cron_1.CronJob(" 0 0 * * *", tokensRemover);
