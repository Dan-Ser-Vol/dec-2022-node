"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const mongoose_1 = require("mongoose");
const action_token_type_enum_1 = require("../enums/action-token-type.enum");
const User_model_1 = require("./User.model");
const actionSchema = new mongoose_1.Schema({
    actionToken: { type: String, required: true },
    tokenType: { type: String, required: true, enum: action_token_type_enum_1.EActionTokenTypes },
    _userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: User_model_1.User,
    },
});
exports.Action = (0, mongoose_1.model)("action", actionSchema);
