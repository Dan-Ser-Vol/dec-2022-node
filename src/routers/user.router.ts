import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get("/", userController.findAll);

router.get("/:id", commonMiddleware.isIdValid, userController.findById);

router.post("/", userMiddleware.isCreateValid, userController.create);

router.put("/:id", commonMiddleware.isIdValid, userController.updateById);

router.delete("/:id", commonMiddleware.isIdValid, userController.deleteById);

export const userRouter = router;
