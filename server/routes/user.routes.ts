import express from "express";
import {
  activateAccount,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../utils/auth";
const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/validatecode", activateAccount);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);

export default userRouter;
