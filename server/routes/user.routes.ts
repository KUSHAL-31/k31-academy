import express from "express";
import { activateAccount, registerUser } from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/validatecode", activateAccount);

export default userRouter;
