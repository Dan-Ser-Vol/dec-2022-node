import { model, Schema, Types } from "mongoose";

import { User } from "./User.model";

const videoSchema = new Schema(
  {
    path: { type: String, required: true },
    name: { type: String },
    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  { timestamps: true, versionKey: false }
);

export const Video = model("Video", videoSchema);
