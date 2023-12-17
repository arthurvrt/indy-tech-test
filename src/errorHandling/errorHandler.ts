import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationResponse } from "../types/useCode";
import { CustomError } from "./CustomError";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ValidationResponse;
  const { name } = req.body;
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof CustomError) {
    response = {
      promocode_name: name,
      status: "denied",
      reasons: [err.message],
    };
    return res.status(err.status).json(response);
  }

  response = {
    promocode_name: "",
    status: "denied",
    reasons: ["Something went wrong"],
  };
  return res.status(500).send(response);
};
