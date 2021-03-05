import Joi from "joi";

//email and password is required.
//password. This regex will enforce these rules:
// At least one upper case English letter, (?=.*?[A-Z])
// At least one lower case English letter, (?=.*?[a-z])
// At least one digit, (?=.*?[0-9])
// At least one special character, (?=.*?[#?!@$%^&*-])
// Minimum eight in length .{8,} (with the anchors)

export const userSchema = Joi.object({
  birthdate: Joi.date().timestamp().iso(),
  gender: Joi.string().valid("male", "female"),
}).options({ allowUnknown: true });
