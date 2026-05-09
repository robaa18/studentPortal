import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validations.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import * as userValidation from "./user.validations.js";

const router = Router();

router.get(
  "/profile",
  authentication(),
  userService.getProfile
);

router.put(
  "/profile",
  authentication(),
  validation(userValidation.updateProfileSchema),
  userService.updateProfile
);

router.get(
  "/",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  userService.getAllUsers
);

router.post(
  "/add-user",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(userValidation.addUserSchema),
  userService.addUser
);

router.put(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(userValidation.updateUserSchema),
  userService.updateUserById
);

router.delete(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(userValidation.idParamSchema),
  userService.deleteUserById
);

export default router;
