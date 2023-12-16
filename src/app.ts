import express, { Express } from "express";
import bodyParser from "body-parser";
import { CodeCreation } from "./types/createCode";
import promocodeRouter from "./routes/promocodeRouter";
import { errorHandler } from "./errorHandler";

export const promoCodes: CodeCreation[] = [];

const createApp = (): Express => {
  const app = express();

  app.use(bodyParser.json());

  app.use("/promocode", promocodeRouter);

  app.use(errorHandler);

  return app;
};

export default createApp;
