import { Router } from "express";
import * as scheduleService from "./schedule.service.js";
import * as scheduleValidation from "./schedule.validations.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validations.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const router = Router();

router.get(
  "/",
  authentication(),
  scheduleService.getSchedule
);

router.post(
  "/",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(scheduleValidation.scheduleSchema),
  scheduleService.createSchedule
);

router.put(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(scheduleValidation.updateScheduleSchema),
  scheduleService.updateSchedule
);

router.delete(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(scheduleValidation.idParamSchema),
  scheduleService.deleteSchedule
);

export default router;
