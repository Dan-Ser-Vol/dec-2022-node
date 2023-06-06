import express, { Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { User } from "./models/User.model";
import { IUser } from "./types/user.type";

const app = express();
app.use(express.json());

app.get(
  "/users",
  async (req: Request, res: Response): Promise<Response<IUser[]>> => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
);

app.get(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json({ user, message: "user founded" });
    } catch (e) {
      console.log(e);
    }
  }
);

app.post(
  "/users",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const user = await User.create(req.body);
      return res.status(201).json({ user, message: "user created" });
    } catch (e) {
      console.log(e);
    }
  }
);

app.put(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<IUser>> => {
    try {
      const { id } = req.params;
      const updateUser = await User.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: "after" }
      );
      return res.status(200).json({ updateUser, message: "user updated" });
    } catch (e) {
      console.log(e);
    }
  }
);

app.delete(
  "/users/:id",
  async (req: Request, res: Response): Promise<Response<void>> => {
    try {
      const { id } = req.params;
      await User.findOneAndDelete({ _id: id }, { ...req.body });
      return res.status(200).json({ message: "user deleted" });
    } catch (e) {
      console.log(e);
    }
  }
);

app.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL);
  console.log(`server worked on port ${configs.PORT}`);
});
