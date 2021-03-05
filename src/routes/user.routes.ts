import { Router } from "express";
import createError from "http-errors";
import { IUser, User } from "../db";
import { userSchema } from "../validator";
import { verifyAccessToken } from "../helpers";

export const userRoutes = Router();

userRoutes.get("/me", verifyAccessToken, async (req, res, next) => {
  try {
    const userId: string = req.body.decoded.aud;
    if (!userId) throw new createError.BadRequest();
    const user = await User.findById(userId, { password: 0 });
    if (!user) throw new createError.NotFound();
    return res.send(user);
  } catch (err) {
    next(err);
  }
});

userRoutes.patch("/update", verifyAccessToken, async (req, res, next) => {
  try {
    const userId: string = req.body.decoded.aud;
    if (!userId) throw new createError.BadRequest();
    const { birthdate, gender } = await userSchema.validateAsync(req.body);
    const user = await User.findById(userId, { password: 0 });
    if (!user) throw new createError.NotFound();
    user.birthdate = birthdate ?? user.birthdate;
    user.gender = gender ?? user.gender;
    await user.save();
    return res.send(user);
  } catch (err) {
    next(err);
  }
});

userRoutes.delete("/delete", verifyAccessToken, async (req, res, next) => {
  try {
    const userId: string = req.body.decoded.aud;
    if (!userId) throw new createError.BadRequest();
    const user = await User.findById(userId);
    if (!user) throw new createError.NotFound();
    await user.remove();
    return res.send({ message: "user removed" });
  } catch (err) {
    next(err);
  }
});
