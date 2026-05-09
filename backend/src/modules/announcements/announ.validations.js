import Joi from "joi";
import { generalFields } from "../../middleware/validations.middleware.js";

export const createAnnouncementSchema = {
  body: Joi.object({
    title: generalFields.title.required(),
    content: generalFields.content.required(),
  }),
};

export const updateAnnouncementSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
  body: Joi.object({
    title: generalFields.title.optional(),
    content: generalFields.content.optional(),
  }).min(1),
};

export const deleteAnnouncementSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }),
};
