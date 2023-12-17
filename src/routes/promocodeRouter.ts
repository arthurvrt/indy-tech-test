import express from "express";
import { createCode } from "../controllers/createCode";
import { useCode } from "../controllers/useCode";
import { checkUseInput } from "../inputError/checkUseInput";
import { checkCreationInput } from "../inputError/checkCreationInput";

const promocodeRouter = express.Router();

promocodeRouter.post("/create", checkCreationInput, createCode);
promocodeRouter.post("/use", checkUseInput, useCode);

export default promocodeRouter;
