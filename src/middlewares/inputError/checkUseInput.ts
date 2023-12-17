import { NextFunction, Request, Response } from "express";
import { promoCodes } from "../../app";
import { CustomError } from "../errorHandling/CustomError";
import { ErrMessage } from "../errorHandling/errorMessages";
import { CodeUsage } from "../../types/useCode";

import Joi from "joi";

const useCodeSchema = Joi.object({
  name: Joi.string().required(),
  arguments: Joi.object({
    age: Joi.number().integer().min(0),
    date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    meteo: Joi.object({
      town: Joi.string().required(),
    }),
  }),
});

const doesPromocodeExist = (name: string): void => {
  const promocode = promoCodes.find((code) => code.name === name);

  if (!promocode) throw new CustomError(400, ErrMessage.CODE.MISSING);
};

export const checkUseInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name }: CodeUsage = req.body;

  const result = useCodeSchema.validate(req.body);

  if (result.error) {
    throw new CustomError(400, result.error.message);
  }

  doesPromocodeExist(name);

  next();
};
