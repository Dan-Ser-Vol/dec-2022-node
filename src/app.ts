import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs/config";
import { ApiError } from "./errors";
import { authRouter, userRouter } from "./routers";

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({ message: err.message, status: err.status });
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  console.log(`server started on port ${configs.PORT}`);
});
