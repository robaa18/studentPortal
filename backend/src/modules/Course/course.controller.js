import { Router } from "express";
import * as courseService from "./course.service.js";
import * as courseValidation from "./course.validations.js";
import { validation } from "../../middleware/validations.middleware.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const router = Router();

router.get(
  "/",
  authentication(),
  courseService.getAllCourses
);

router.post(
  "/",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(courseValidation.courseSchema),
  courseService.createCourse
);

router.post(
  "/enroll",
  authentication(),
  validation(courseValidation.enrollSchema),
  courseService.enrollCourse
);

router.delete(
  "/withdraw",
  authentication(),
  validation(courseValidation.withdrawSchema),
  courseService.withdrawCourse
);

router.get(
  "/my-courses",
  authentication(),
  courseService.getMyCourses
);

router.put(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(courseValidation.updateCourseSchema),
  courseService.updateCourse
);

router.delete(
  "/:id",
  authentication(),
  authorization({ role: [RoleEnum.ADMIN] }),
  validation(courseValidation.idParamSchema),
  courseService.deleteCourse
);

export default router;
