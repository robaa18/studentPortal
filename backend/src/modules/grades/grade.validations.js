import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const gradeSchema = {
  body: Joi.object({
    student: generalFields.id.required(),
    course: generalFields.id.required(),
    grade: Joi.alternatives().try(
      Joi.string().valid("A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"),
      Joi.number().min(0).max(100)
    ).required(),
    score: Joi.number().min(0).max(100).optional(),
  }),
};

export const idParamSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
