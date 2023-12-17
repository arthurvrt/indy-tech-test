import { Request, Response } from "express";
import { promoCodes } from "../app";
import { ValidationResponse } from "../types/useCode";
import { validateRestrictions } from "../servicies/validationLogic";
import { ErrMessage } from "../middlewares/errorHandling/errorMessages";
import { CustomError } from "../middlewares/errorHandling/CustomError";

export const useCode = async (req: Request, res: Response) => {
  let response: ValidationResponse;
  const {
    name,
    arguments: { age, date, meteo },
  } = req.body;

  const promocode = promoCodes.find((code) => code.name === name);

  if (!promocode) throw new CustomError(400, ErrMessage.CODE.MISSING);

  try {
    const restrictionResponse = await validateRestrictions(
      promocode.restrictions,
      {
        age,
        date,
        meteo,
      }
    );
    if (!restrictionResponse.isValid) {
      response = {
        name,
        status: "denied",
        reasons: restrictionResponse.reasons,
      };

      return res.status(403).json(response);
    }
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw new CustomError(403, `${(error as CustomError).message}`);
    } else {
      throw error;
    }
  }

  response = {
    name,
    status: "accepted",
    avantage: { percent: promocode?.avantage.percent },
  };

  return res.status(200).json(response);
};
