import limiter from "express-rate-limit";
import createError from "http-errors";

export const registerLimiter = limiter({
  windowMs: 1000 * 60 * 5, // 5 minutes
  max: 2,
  message: new createError.TooManyRequests(),
});

export const loginLimiter = limiter({
  windowMs: 1000 * 60 * 1, // 1 minute
  max: 5,
  message: new createError.TooManyRequests(),
});

export const refreshTokenLimiter = limiter({
  windowMs: 1000 * 60 * 5, // 5 minutes
  max: 3,
  message: new createError.TooManyRequests(),
});
