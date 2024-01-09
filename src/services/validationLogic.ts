import { ErrMessage } from "../middlewares/errorHandling/errorMessages";
import { getWeather } from "../thirdParty/openWeather/openWeatherApi";
import {
  AgeRestriction,
  AndRestriction,
  DateRestriction,
  OrRestriction,
  Restriction,
  MeteoRestriction,
} from "../types/createCode";
import { CodeUsageArgs, EvaluationResult } from "../types/useCode";
import { isAfter, isBefore } from "date-fns";

export const validateRestrictions = async (
  restrictions: Restriction[],
  requestArguments: CodeUsageArgs
): Promise<EvaluationResult> => {
  const results = await Promise.all(
    restrictions.map((restriction) =>
      checkSingleRestriction(restriction, requestArguments)
    )
  );

  return {
    isValid: results.every((e) => e.isValid),
    reasons: results.map((result) => result.reasons || []).flat(),
  };
};

export const checkSingleRestriction = async (
  restriction: Restriction,
  requestArguments: CodeUsageArgs
): Promise<EvaluationResult> => {
  const restrictionKey = Object.keys(restriction)[0];

  switch (restrictionKey) {
    case "@date":
      return dateRule(restriction as DateRestriction, requestArguments);
    case "@age":
      return ageRule(restriction as AgeRestriction, requestArguments);
    case "@meteo":
      return await meteoRule(restriction as MeteoRestriction, requestArguments);
    case "@or":
      return await orRule(restriction as OrRestriction, requestArguments);
    case "@and":
      return await andRule(restriction as AndRestriction, requestArguments);
    default:
      return {
        isValid: true,
      };
  }
};

export function dateRule(
  restriction: DateRestriction,
  requestArguments: CodeUsageArgs
): EvaluationResult {
  const { after, before } = restriction["@date"];
  const afterDate = after ? new Date(after) : null;
  const beforeDate = before ? new Date(before) : null;
  const rideDate = requestArguments.date
    ? new Date(requestArguments.date)
    : new Date();

  const isValidDate =
    (!afterDate || isAfter(rideDate, afterDate)) &&
    (!beforeDate || isBefore(rideDate, beforeDate));

  if (!isValidDate) {
    return {
      isValid: false,
      reasons: [ErrMessage.DATE.INVALID],
    };
  }

  return {
    isValid: true,
  };
}

export function ageRule(
  restriction: AgeRestriction,
  requestArguments: CodeUsageArgs
): EvaluationResult {
  const {
    "@age": { lt, eq, gt },
  } = restriction;

  if (!requestArguments.age) {
    return {
      isValid: false,
      reasons: [ErrMessage.AGE.MISSING],
    };
  }
  if (eq && requestArguments.age !== eq) {
    return {
      isValid: false,
      reasons: [ErrMessage.AGE.INVALID_EQ],
    };
  }
  if (lt && requestArguments.age >= lt) {
    return {
      isValid: false,
      reasons: [ErrMessage.AGE.INVALID_LT],
    };
  }
  if (gt && requestArguments.age <= gt) {
    return {
      isValid: false,
      reasons: [ErrMessage.AGE.INVALID_GT],
    };
  }
  return {
    isValid: true,
  };
}

export async function meteoRule(
  restriction: MeteoRestriction,
  requestArguments: CodeUsageArgs
): Promise<EvaluationResult> {
  const {
    "@meteo": { is, temp },
  } = restriction;

  if (!requestArguments.meteo?.town) {
    return {
      isValid: false,
      reasons: [ErrMessage.LOCATION.NO_SPECIFIED],
    };
  }

  try {
    const weather = await getWeather(requestArguments.meteo.town);

    // Weather response: https://openweathermap.org/current#parameter
    // "is" possibilities : https://openweathermap.org/weather-conditions

    if (is && weather.weather[0].description !== is) {
      return {
        isValid: false,
        reasons: [ErrMessage.METEO.IS_INVALID],
      };
    }

    if (temp) {
      if (temp.gt && weather.main.temp <= temp.gt) {
        return {
          isValid: false,
          reasons: [ErrMessage.METEO.TEMP_GT_INVALID],
        };
      }
      if (temp.lt && weather.main.temp >= temp.lt) {
        return {
          isValid: false,
          reasons: [ErrMessage.METEO.TEMP_LT_INVALID],
        };
      }
    }
    return {
      isValid: true,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function andRule(
  andRestriction: AndRestriction,
  requestArguments: CodeUsageArgs
): Promise<EvaluationResult> {
  return await validateRestrictions(andRestriction["@and"], requestArguments);
}

export async function orRule(
  orRestriction: OrRestriction,
  requestArguments: CodeUsageArgs
): Promise<EvaluationResult> {
  const results = await Promise.all(
    orRestriction["@or"].map((restriction) =>
      checkSingleRestriction(restriction, requestArguments)
    )
  );

  return {
    isValid: results.some((e) => e.isValid),
    reasons: results.some((e) => e.isValid)
      ? []
      : results.map((result) => result.reasons || []).flat(),
  };
}
