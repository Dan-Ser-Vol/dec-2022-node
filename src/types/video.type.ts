import { Types } from "mongoose";

export interface IVideo {
  path: string;
  name: string;
  _userId: Types.ObjectId;
}
