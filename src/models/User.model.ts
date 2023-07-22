import { model, Schema } from "mongoose";

import { EGenders } from "../enums/user.enum";
import { EUserStatus } from "../enums/user-status.enum";

const userSchema = new Schema(
  {
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
      enum: EGenders,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    status: { type: String, default: EUserStatus.Inactive, enum: EUserStatus },
    activationToken: { type: String },

    avatar: { type: String, required: false },
    phone: { type: String, required: false, trim: true },
    video: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("user", userSchema);
