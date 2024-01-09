import express from "express";
import { createCode } from "../controllers/createCode";
import { useCode } from "../controllers/useCode";
import { checkUseInput } from "../middlewares/inputError/checkUseInput";
import { checkCreationInput } from "../middlewares/inputError/checkCreationInput";

const promocodeRouter = express.Router();

promocodeRouter.post("/create", checkCreationInput, async (req, res) => {
  await createCode(req, res);
});

promocodeRouter.post("/use", checkUseInput, async (req, res) => {
  await useCode(req, res);
});

export default promocodeRouter;
