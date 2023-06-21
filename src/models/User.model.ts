import { model, Schema } from "mongoose";

import { EGenders } from "../enums/user.enum";

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
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("user", userSchema);
