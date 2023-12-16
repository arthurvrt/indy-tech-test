import { Avantage } from "./createCode";

export interface Meteo {
  town: string;
}
export interface CodeUsageArgs {
  age?: number;
  date?: string; // to allow future bookings
  meteo?: Meteo;
}

export interface CodeUsage {
  promocode_name: string;
  arguments: CodeUsageArgs;
}

export type ValidationResponseStatus = "accepted" | "denied";

export interface ValidationResponse {
  promocode_name: string;
  status: ValidationResponseStatus;
  avantage?: Avantage;
  reasons?: string[];
}

export interface EvaluationResult {
  isValid: boolean;
  reasons?: string[];
}
