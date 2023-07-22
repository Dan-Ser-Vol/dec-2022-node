"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http = __importStar(require("http"));
const mongoose = __importStar(require("mongoose"));
const socket_io_1 = require("socket.io");
const swaggerUi = __importStar(require("swagger-ui-express"));
const config_1 = require("./configs/config");
const crons_1 = require("./crons");
const routers_1 = require("./routers");
const swaggerJson = __importStar(require("./utils/swagger.json"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
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
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
});
app.use("*", limiter);
app.use("/users", routers_1.userRouter);
app.use("/auth", routers_1.authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use((err, req, res, next) => {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message, status: err.status });
});
server.listen(config_1.configs.PORT, async () => {
    await mongoose.connect(config_1.configs.DB_URL);
    (0, crons_1.cronRunner)();
    console.log(`server started on port ${config_1.configs.PORT}`);
});
