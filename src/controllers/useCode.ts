import { Request, Response } from "express";
import { promoCodes } from "../app";
import { ValidationResponse } from "../types/useCode";

export const useCode = async (req: Request, res: Response) => {
  const {
    promocode_name,
    arguments: { age, date, meteo },
  } = req.body;

  const promocode = promoCodes.find((code) => code.name === promocode_name);

  if (!promocode) throw new Error("missing code");

  try {
    //TODO: restriction logic
  } catch (error) {
    throw error;
  }

  const response: ValidationResponse = {
    promocode_name,
    status: "accepted",
    avantage: { percent: promocode?.avantage.percent },
  };

  return res.status(200).json(response);
};
