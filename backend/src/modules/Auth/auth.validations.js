import Joi from "joi";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import { generalFields } from "../../middleware/validations.middleware.js";

export const registerSchema = {
  body: Joi.object({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
    role: generalFields.role.default(RoleEnum.STUDENT),
    firstName: generalFields.firstName.when("role", {
      is: RoleEnum.ADMIN,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    lastName: generalFields.lastName.when("role", {
      is: RoleEnum.ADMIN,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    studentID: generalFields.studentID.when("role", {
      is: RoleEnum.ADMIN,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    academicLevel: generalFields.academicLevel.when("role", {
      is: RoleEnum.ADMIN,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    email: generalFields.email.when("role", {
      is: RoleEnum.ADMIN,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    phoneNumber: generalFields.phoneNumber,
    major: generalFields.major,
  }),
};

export const loginSchema = {
  body: Joi.object({
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
  }),
};
