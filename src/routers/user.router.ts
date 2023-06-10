import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.findAll);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.findById
);

router.post(
  "/",
  commonMiddleware.isBodyValid(UserValidator.create),
  userController.create
);

router.put(
  "/:userId",
  commonMiddleware.isBodyValid(UserValidator.update),
  commonMiddleware.isIdValid("userId"),
  userController.updateById
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById
);

export const userRouter = router;
