import express from "express";
import { createCode } from "../controllers/createCode";
import { useCode } from "../controllers/useCode";
import { checkUseInput } from "../middlewares/inputError/checkUseInput";
import { checkCreationInput } from "../middlewares/inputError/checkCreationInput";

const promocodeRouter = express.Router();

promocodeRouter.post("/create", checkCreationInput, createCode);
promocodeRouter.post("/use", checkUseInput, useCode);

export default promocodeRouter;
