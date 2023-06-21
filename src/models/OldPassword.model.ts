import { model, Schema, Types } from "mongoose";

import { User } from "./User.model";

const oldPassword = new Schema(
  {
    password: { type: String, required: true },
    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  { timestamps: true, versionKey: false }
);

export const OldPassword = model("OldPassword", oldPassword);
