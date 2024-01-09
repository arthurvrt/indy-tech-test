import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errorHandling/CustomError";
import { ErrMessage } from "../errorHandling/errorMessages";
import { CodeUsage } from "../../types/useCode";

import Joi from "joi";
import { findPromocode } from "../../repositories/promoCodesRepository";

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

const doesPromocodeExist = async (name: string): Promise<void> => {
  const promocode = await findPromocode(name);
  if (!promocode) throw new CustomError(400, ErrMessage.CODE.MISSING);
};

export const checkUseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name }: CodeUsage = req.body;

  const result = useCodeSchema.validate(req.body);

  if (result.error) {
    throw new CustomError(400, result.error.message);
  }

  try {
    await doesPromocodeExist(name);
    next();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }

  next();
};
