import express from "express";

const promocodeRouter = express.Router();

promocodeRouter.post("/create");
promocodeRouter.post("/use");

export default promocodeRouter;
