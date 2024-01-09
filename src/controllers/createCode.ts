import { Request, Response } from "express";
import { CodeCreation } from "../types/createCode";
import { createPromocode } from "../repositories/promoCodesRepository";

export const createCode = async (req: Request, res: Response) => {
  const newPromoCode: CodeCreation = req.body;
  await createPromocode(newPromoCode);
  return res.status(200).json({ message: "Promocode created with succes" });
};
