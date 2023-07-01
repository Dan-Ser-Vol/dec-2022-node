import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.findAll);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  userController.findById
);

router.post(
  "/:userId/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar
);

router.delete(
  "/:userId/avatar",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  userController.deleteAvatar
);

router.put(
  "/:userId",
  commonMiddleware.isBodyValid(UserValidator.update),
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  userController.updateById
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById
);

router.post("/:userId/video", userController.uploadVideo);

router.get(
  "/:userId/video",
  commonMiddleware.isIdValid("userId"),
  // authMiddleware.checkAccessToken,
  userController.findVideoById
);

export const userRouter = router;
