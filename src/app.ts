import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";
import cors from "cors";

// Import routes
import { defaultRoutes, authRoutes } from "./routes";
import { globalLimiter } from "./limiters";

export const app = express();

// Middlewares
app.use(globalLimiter);
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
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
