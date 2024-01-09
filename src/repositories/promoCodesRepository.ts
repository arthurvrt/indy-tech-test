import { CodeCreation } from "../types/createCode";

const promoCodes = new Map<string, CodeCreation>();

export const createPromocode = async (
  newPromoCode: CodeCreation
): Promise<void> => {
  promoCodes.set(newPromoCode.name, newPromoCode);
};

export const findPromocode = async (
  codeName: string
): Promise<CodeCreation | undefined> => {
  return promoCodes.get(codeName);
};
