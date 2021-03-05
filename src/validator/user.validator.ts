import Joi from "joi";

export const userSchema = Joi.object({
  birthdate: Joi.date().timestamp().iso(),
  gender: Joi.string().valid("male", "female"),
}).options({ allowUnknown: true });
