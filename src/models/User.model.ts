import { model, Schema } from "mongoose";

import { EGenders } from "../enums/user.enum";

const userSchema = new Schema(
  {
    name: {
      type: String,
      min: [2, "min 2 symbol"],
      max: [10, "min 10 symbol"],
      required: true,
    },
    age: {
      type: Number,
      min: [1, "min 1 year"],
      max: [100, "min 100 year"],
      required: true,
    },
    gender: {
      type: String,
      enum: EGenders,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("user", userSchema);
