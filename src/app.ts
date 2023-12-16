import express, { Express } from "express";
import bodyParser from "body-parser";
import { CodeCreation } from "./types/createCode";

export const promoCodes: CodeCreation[] = [];

const createApp = (): Express => {
  const app = express();

  app.use(bodyParser.json());

  return app;
};

export default createApp;
