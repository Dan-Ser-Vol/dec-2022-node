import { model, Schema, Types } from "mongoose";

import { User } from "./User.model";

const tokenSchema = new Schema({
  accessToken: { type: String, refreshToken: true },
  refreshToken: { type: String, required: true },
  _userId: { type: Types.ObjectId, required: true, ref: User },
});

export const Token = model("Token", tokenSchema);
