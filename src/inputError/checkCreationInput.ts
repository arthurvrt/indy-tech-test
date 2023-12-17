import { NextFunction, Request, Response } from "express";
import {
  AgeRestriction,
  AndRestriction,
  DateRestriction,
  OrRestriction,
  Restriction,
  MeteoRestriction,
} from "../types/createCode";

import { CustomError } from "../errorHandling/CustomError";
import { promoCodes } from "../app";
import { ErrMessage } from "../errorHandling/errorMessages";

const verifyDate = (restriction: DateRestriction): void => {
  const {
    "@date": { after, before },
  } = restriction;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (after) {
    if (typeof after !== "string") {
      throw new CustomError(400, ErrMessage.INPUT.DATE.AFTER_INVALID);
    }
    if (!regex.test(after)) {
      throw new CustomError(400, `After ${ErrMessage.DATE.FORMAT}`);
    }
  }
  if (before) {
    if (typeof before !== "string") {
      throw new CustomError(400, ErrMessage.INPUT.DATE.BEFORE_INVALID);
    }
    if (!regex.test(before)) {
      throw new CustomError(400, `Before ${ErrMessage.DATE.FORMAT}`);
    }
  }
};

const verifyAge = (restriction: AgeRestriction): void => {
  const {
    "@age": { eq, lt, gt },
  } = restriction;

  if (eq && typeof eq !== "number")
    throw new CustomError(400, ErrMessage.INPUT.AGE.EQ_INVALID);
  if (lt && typeof lt !== "number")
    throw new CustomError(400, ErrMessage.INPUT.AGE.LT_INVALID);
  if (gt && typeof gt !== "number")
    throw new CustomError(400, ErrMessage.INPUT.AGE.GT_INVALID);
};

const verifyMeteo = (restriction: MeteoRestriction): void => {
  const {
    "@meteo": { is, temp },
  } = restriction;

  if (is && typeof is !== "string")
    throw new CustomError(400, ErrMessage.INPUT.METEO.IS_INDALID);
  if (temp && typeof temp !== "object")
    throw new CustomError(400, ErrMessage.INPUT.METEO.TEMP_INVALID);
  if (temp?.gt && typeof temp?.gt !== "number")
    throw new CustomError(400, ErrMessage.INPUT.METEO.GT_INVALID);
  if (temp?.lt && typeof temp?.lt !== "number")
    throw new CustomError(400, ErrMessage.INPUT.METEO.LT_INVALID);
};

const verifyOr = (restriction: OrRestriction): void => {
  const { "@or": restrictions } = restriction;
  return verifyRestriction(restrictions);
};

const verifyAnd = (restriction: AndRestriction): void => {
  const { "@and": restrictions } = restriction;
  return verifyRestriction(restrictions);
};

const verifyRestrictionStructure = (restriction: Restriction): void => {
  switch (Object.keys(restriction)[0]) {
    case "@date":
      verifyDate(restriction as DateRestriction);
      break;
    case "@age":
      verifyAge(restriction as AgeRestriction);
      break;
    case "@meteo":
      verifyMeteo(restriction as MeteoRestriction);
      break;
    case "@or":
      verifyOr(restriction as OrRestriction);
      break;
    case "@and":
      verifyAnd(restriction as AndRestriction);
      break;
    default:
      return;
  }
};

const verifyRestriction = (restrictions: Restriction[]): void => {
  if (!Array.isArray(restrictions))
    throw new CustomError(400, ErrMessage.INPUT.RESTRICTION.INVALID);

  for (const restriction of restrictions) {
    verifyRestrictionStructure(restriction);
  }
};

const verifyName = (name: string): void => {
  if (!name) throw new CustomError(400, ErrMessage.INPUT.NAME.MISSING);
  else if (typeof name !== "string")
    throw new CustomError(400, ErrMessage.INPUT.NAME.INVALID);
  else if (promoCodes.find((code) => code.name === name))
    throw new CustomError(400, ErrMessage.INPUT.NAME.ALREADY_EXISTS);
};

const verifyAvantage = (avantage: { percent: number }): void => {
  if (!avantage) throw new CustomError(400, ErrMessage.INPUT.AVANTAGE.MSSING);
  else if (typeof avantage.percent !== "number")
    throw new CustomError(400, ErrMessage.INPUT.AVANTAGE.INVALID);
};

export const checkCreationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, avantage, restrictions } = req.body;

  verifyName(name);
  verifyAvantage(avantage);
  verifyRestriction(restrictions);

  next();
};
