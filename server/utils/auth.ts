require("dotenv").config();
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

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

    
}