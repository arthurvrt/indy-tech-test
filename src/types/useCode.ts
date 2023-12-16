import { Avantage } from "./createCode";

export type ValidationResponseStatus = "accepted" | "denied";

export interface ValidationResponse {
  promocode_name: string;
  status: ValidationResponseStatus;
  avantage?: Avantage;
  reasons?: string[];
}
