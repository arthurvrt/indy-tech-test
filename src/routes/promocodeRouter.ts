import express from "express";
import { createCode } from "../controllers/createCode";
import { useCode } from "../controllers/useCode";

const promocodeRouter = express.Router();

promocodeRouter.post("/create", createCode);
promocodeRouter.post("/use", useCode);

export default promocodeRouter;
