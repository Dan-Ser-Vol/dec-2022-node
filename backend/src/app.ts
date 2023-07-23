import express, {NextFunction, Request, Response} from "express";
import * as mongoose from "mongoose";

import {configs} from "./configs/config";
import {ApiError} from "./errors";
import {authRouter, userRouter} from "./routers";

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    return res.status(status).json({message: err.message, status: err.status});
});


const dbConnect = async () => {
    let dbCon = false

    while (!dbCon) {
        try {
            console.log(`Connecting to database ${configs.DB_URL}`);
            await mongoose.connect(configs.DB_URL);
            dbCon = true
        } catch (err) {
            console.log( "ERROR", err)
            console.log("Database unavailable, wait 3 seconds");
            await new Promise((resolve) => setTimeout(resolve, 3000))
        }
    }

}

const start = async () => {
    try {
        await dbConnect()
        await app.listen(configs.PORT, async () => {
            console.log(`server started on port ${configs.PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}
start()
