import { Request, Response } from "express";
import { promoCodes } from "../app";
import { CodeCreation } from "../types/createCode";

export const createCode = (req: Request, res: Response) => {
  const newPromoCode: CodeCreation = req.body;
  promoCodes.push(newPromoCode);
  return res.status(200).json({ message: "Promocode created with succes" });
};
