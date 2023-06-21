import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  userMiddleware.findOneOrThrow("email"),
  authController.register
);

router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserExist,
  authController.login
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);

router.get(
  "/activate/:link",
  authMiddleware.checkIsActivated,
  authController.activate
);

router.post(
  "/changePassword",
  // commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword
);

export const authRouter = router;
