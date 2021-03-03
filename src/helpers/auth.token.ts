import JWT, { decode } from "jsonwebtoken";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { Redis } from "./redis";

// Decode userId at https://jwt.io/

export const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = { name: process.env.APP_NAME };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      issuer: "jwt.io",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createError.InternalServerError());
      resolve(token);
    });
  });
};

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) return next(new createError.Unauthorized());
  const token = authorization.split(" ")[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(new createError.Unauthorized(message));
    }
    req.body.decoded = decoded;
    next();
  });
};

export const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = { name: process.env.APP_NAME };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      issuer: "jwt.io",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createError.InternalServerError());
      Redis.client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err) => {
        if (err) {
          console.log(err.message);
          return reject(new createError.InternalServerError());
        }
        resolve(token);
      });
    });
  });
};

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return reject(new createError.Unauthorized());
        // @ts-ignore
        const userId = decoded.aud;

        Redis.client.GET(userId, (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(new createError.InternalServerError());
          }
          if (refreshToken === result) return resolve(userId);
          reject(new createError.Unauthorized());
        });
      }
    );
  });
};
