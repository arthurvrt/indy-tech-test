import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationResponse } from "./types/useCode";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  const response: ValidationResponse = {
    promocode_name: "",
    status: "denied",
    reasons: ["Something went wrong"],
  };
  return res.status(500).send(response);
};
