import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import * as http from "http";
import * as mongoose from "mongoose";
import { Server, Socket } from "socket.io";
// import * as swaggerUi from "swagger-ui-express";

import { configs } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors";
import { authRouter, userRouter } from "./routers";
// import * as swaggerJson from "./utils/swagger.json";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
  // eslint-disable-next-line
  console.log(socket.id);

  socket.on("message: create", () => {
    socket.emit("message: receive", { message: true });
  });

  socket.on("broadcast: all", () => {
    socket.broadcast.emit("alert", "this message fot all");
  });

  socket.on("room: joinUser", ({ roomId }) => {
    socket.join(roomId);
    io.to(roomId).emit(`room: newUserAlert`, socket.id);
  });
});

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

app.use("*", limiter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({ message: err.message, status: err.status });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  cronRunner();
  // eslint-disable-next-line no-console
  console.log(`server started on port ${configs.PORT}`);
});
