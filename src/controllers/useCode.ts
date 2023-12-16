import { Request, Response } from "express";
import { promoCodes } from "../app";
import { ValidationResponse } from "../types/useCode";
import { validateRestrictions } from "../servicies/validationLogic";

export const useCode = async (req: Request, res: Response) => {
  let response: ValidationResponse;
  const {
    promocode_name,
    arguments: { age, date, meteo },
  } = req.body;

  const promocode = promoCodes.find((code) => code.name === promocode_name);

  if (!promocode) throw new Error("missing code");

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
        promocode_name,
        status: "denied",
        reasons: restrictionResponse.reasons,
      };

      return res.status(403).json(response);
    }
  } catch (error: unknown) {
    throw error;
  }

  response = {
    promocode_name,
    status: "accepted",
    avantage: { percent: promocode?.avantage.percent },
  };

  return res.status(200).json(response);
};
