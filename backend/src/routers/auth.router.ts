import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userMiddleware } from "../middlewares/user.middleware";


const router = Router();

router.post(
  "/register",
  userMiddleware.findOneOrThrow("email"),
  authController.register
);

router.post(
  "/login",
  userMiddleware.isUserExist,
  authController.login
);

export const authRouter = router;
