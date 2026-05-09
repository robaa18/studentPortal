import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const courseSchema = {
  body: Joi.object({
    title: generalFields.title.required(),
    code: generalFields.code.required(),
    instructor: generalFields.id.optional(),
    capacity: generalFields.capacity.optional(),
    credits: generalFields.credits.optional(),
    section: Joi.string().min(1).max(20).optional(),
  }),
};

export const updateCourseSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  body: Joi.object({
    title: generalFields.title.optional(),
    code: generalFields.code.optional(),
    instructor: generalFields.id.allow(null).optional(),
    capacity: generalFields.capacity.optional(),
    credits: generalFields.credits.optional(),
    section: Joi.string().min(1).max(20).optional(),
  }).min(1),
};

export const enrollSchema = {
  body: Joi.object({
    courseId: generalFields.id.required(),
  }),
};

export const withdrawSchema = enrollSchema;

export const idParamSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
