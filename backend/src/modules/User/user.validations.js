import joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

export const addUserSchema = {
  body: joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    studentID: generalFields.studentID.optional(),
    studentId: generalFields.studentID.optional(),
    academicLevel: generalFields.academicLevel.required(),
    email: generalFields.email.required(),
    phoneNumber: generalFields.phoneNumber,
    phone: generalFields.phoneNumber,
    userName: generalFields.userName.required(),
    password: generalFields.password.required(),
    role: generalFields.role.default(RoleEnum.STUDENT),
    major: generalFields.major.optional(),
    dateOfBirth: joi.date().optional(),
    gpa: joi.number().min(0).max(4).optional(),
    creditsEarned: joi.number().min(0).optional(),
    creditsTotal: joi.number().min(1).optional(),
    status: joi.string().valid("active", "inactive", "probation").optional(),
  }).or("studentID", "studentId").required(),
};

export const updateProfileSchema = {
  body: joi.object({
    firstName: generalFields.firstName.optional(),
    lastName: generalFields.lastName.optional(),
    studentID: generalFields.studentID.optional(),
    studentId: generalFields.studentID.optional(),
    academicLevel: generalFields.academicLevel.optional(),
    email: generalFields.email.optional(),
    phoneNumber: generalFields.phoneNumber,
    phone: generalFields.phoneNumber,
    major: generalFields.major.optional(),
    dateOfBirth: joi.date().optional(),
  }).min(1),
};

export const updateUserSchema = {
  params: joi.object({
    id: generalFields.id.required(),
  }),
  body: joi.object({
    firstName: generalFields.firstName.optional(),
    lastName: generalFields.lastName.optional(),
    studentID: generalFields.studentID.optional(),
    studentId: generalFields.studentID.optional(),
    academicLevel: generalFields.academicLevel.optional(),
    email: generalFields.email.optional(),
    phoneNumber: generalFields.phoneNumber,
    phone: generalFields.phoneNumber,
    userName: generalFields.userName.optional(),
    password: generalFields.password.optional(),
    role: generalFields.role.optional(),
    major: generalFields.major.optional(),
    dateOfBirth: joi.date().optional(),
    gpa: joi.number().min(0).max(4).optional(),
    creditsEarned: joi.number().min(0).optional(),
    creditsTotal: joi.number().min(1).optional(),
    status: joi.string().valid("active", "inactive", "probation").optional(),
  }).min(1),
};

export const idParamSchema = {
  params: joi.object({
    id: generalFields.id.required(),
  }),
};
