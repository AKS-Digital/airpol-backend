import { Router } from "express";
import createError from "http-errors";
import { User } from "../db";
import { authSchema } from "../validator";
import {
  encodePassword,
  decodePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  Redis,
} from "../helpers";
import {
  registerLimiter,
  loginLimiter,
  refreshTokenLimiter,
} from "../limiters";

export const authRoutes = Router();

authRoutes.post("/register", registerLimiter, async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email });
    if (user)
      throw new createError.Conflict(`${email} is already been registered`);
    const hashedPassword = await encodePassword(password);
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    return res.send({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

authRoutes.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email });
    if (!user) throw new createError.NotFound("User not registered");
    const isValidPassword = await decodePassword(password, user.password);
    if (!isValidPassword)
      throw new createError.Unauthorized("email or password is not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    return res.send({ accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi)
      return next(new createError.BadRequest("Invalid email or password"));
    next(err);
  }
});

authRoutes.post(
  "/refresh-token",
  refreshTokenLimiter,
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || typeof refreshToken !== "string")
        throw new createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      if (typeof userId !== "string") throw new createError.BadRequest();
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      return res.send({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  }
);

authRoutes.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    if (typeof userId === "string")
      Redis.client.DEL(userId, (err, value) => {
        if (err) {
          console.log(err.message);
          throw new createError.InternalServerError();
        }
        res.sendStatus(204);
      });
  } catch (err) {
    next(err);
  }
});
