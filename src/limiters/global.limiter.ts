import limiter from "express-rate-limit";
import createError from "http-errors";

export const globalLimiter = limiter({
  windowMs: 5000, // 5 seconds
  max: 5,
  message: new createError.TooManyRequests(),
});
