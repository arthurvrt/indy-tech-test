import {
  AgeRestriction,
  AndRestriction,
  DateRestriction,
  OrRestriction,
  Restriction,
  WeatherRestriction,
} from "../types/createCode";
import { CodeUsageArgs } from "../types/useCode";

export const validateRestrictions = async (
  restrictions: Restriction[],
  requestArguments: CodeUsageArgs
): Promise<boolean> => {
  const results = await Promise.all(
    restrictions.map((restriction) =>
      checkSingleRestriction(restriction, requestArguments)
    )
  );

  const isValid = results.every(Boolean);

  return isValid;
};

export const checkSingleRestriction = async (
  restriction: Restriction,
  requestArguments: CodeUsageArgs
): Promise<boolean> => {
  const restrictionKey = Object.keys(restriction)[0]; // Assuming there is only one key in restriction

  switch (restrictionKey) {
    case "@date":
      return dateRule(restriction as DateRestriction, requestArguments);
    case "@age":
      return ageRule(restriction as AgeRestriction, requestArguments);
    case "@meteo":
      return meteoRule(restriction as WeatherRestriction, requestArguments);
    case "@or":
      return orRule(restriction as OrRestriction, requestArguments);
    case "@and":
      return andRule(restriction as AndRestriction, requestArguments);
    default:
      return true;
  }
};

export function dateRule(
  restriction: DateRestriction,
  requestArguments: CodeUsageArgs
): boolean {
  return true;
}

export function ageRule(
  restriction: AgeRestriction,
  requestArguments: CodeUsageArgs
): boolean {
  return true;
}

export function meteoRule(
  restriction: WeatherRestriction,
  requestArguments: CodeUsageArgs
): boolean {
  return true;
}

export function andRule(
  andRestriction: AndRestriction,
  requestArguments: CodeUsageArgs
): boolean {
  return true;
}

export function orRule(
  orRestriction: OrRestriction,
  requestArguments: CodeUsageArgs
): boolean {
  return true;
}
