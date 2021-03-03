import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import cors from "cors";

// Import routes
import { defaultRoutes, authRoutes } from "./routes";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Router
app.use("/auth", authRoutes);
app.use(defaultRoutes);

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err.isJoi) {
      throw new createError.UnprocessableEntity(err.details[0].message);
    } else {
      throw createError(err.status, err.message);
    }
  } catch (err) {
    res.status(err.status ?? 500).send(err);
  }
});
