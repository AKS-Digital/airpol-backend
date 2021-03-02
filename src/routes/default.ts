import { Router } from "express";
import createError from "http-errors";

const router = Router();

router.all("*", (req, res, next) => {
  try {
    throw new createError.NotFound("Route doesn't exists");
  } catch (err) {
    next(err);
  }
});

export default router;
