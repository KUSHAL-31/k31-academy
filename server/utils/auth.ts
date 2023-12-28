require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "./errorHandler";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signedAccessToken();
  const refreshToken = user.signedRefreshToken();

  // create session on redis
  redis.set(user._id, JSON.stringify(user) as any);

  const accesssTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300");
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "300"
  );

  // cookie options
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accesssTokenExpire * 1000),
    maxAge: accesssTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessTokenOptions);
  res.cookie("refresh_token", refreshTokenOptions);

  res.status(statusCode).json({ success: true, user, accessToken });
};

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return next(new ErrorHandler("Please login to use this resource", 400));
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    req.user = JSON.parse(user);

    next();
  }
);
