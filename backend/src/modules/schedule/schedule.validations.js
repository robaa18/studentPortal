import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const scheduleSchema = {
  body: Joi.object({
    course: generalFields.id.required(),
    day: generalFields.day.required(),
    time: generalFields.time.required(),
    location: generalFields.location.required(),
  }),
};

export const updateScheduleSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  body: Joi.object({
    course: generalFields.id.optional(),
    day: generalFields.day.optional(),
    time: generalFields.time.optional(),
    location: generalFields.location.optional(),
  }).min(1),
};

export const idParamSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
