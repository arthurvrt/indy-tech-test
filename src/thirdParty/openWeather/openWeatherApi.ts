import { CustomError } from "../../middlewares/errorHandling/CustomError";
import { ErrMessage } from "../../middlewares/errorHandling/errorMessages";
import { GeocodingApiResponse, WeatherApiResponse } from "./openWeatherTypes";
import fetch from "node-fetch";

const LIMIT = 1 as const;

const ensureApiKey = (): string => {
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  if (!apiKey) {
    throw new CustomError(400, ErrMessage.OPENWEATHER_API.MISSING);
  }
  return apiKey;
};

const handleErrorResponse = (errorMessage: string, status: number) => {
  throw new CustomError(400, `${errorMessage} ${status}`);
};

const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    handleErrorResponse(
      ErrMessage.OPENWEATHER_API.FETCH_ERROR,
      response.status
    );
  }
  return response.json();
};

export const getGeocodingUrl = (city: string): string => {
  const apiKey = ensureApiKey();
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${LIMIT}&appid=${apiKey}` as const;
};

export const getOpenWeatherUrl = (lat: number, lon: number): string => {
  const apiKey = ensureApiKey();
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric` as const;
};

const getLocation = async (city: string): Promise<GeocodingApiResponse[]> => {
  const GEOCODING_URL = getGeocodingUrl(city);

  try {
    return (await fetchData(GEOCODING_URL)) as GeocodingApiResponse[];
  } catch (error) {
    throw new CustomError(
      400,
      `${ErrMessage.OPENWEATHER_API.GEOCODING_FAILED} ${error}`
    );
  }
};

export const getWeather = async (city: string): Promise<WeatherApiResponse> => {
  try {
    const location = await getLocation(city);
    if (location.length === 0) {
      throw new CustomError(
        400,
        `${ErrMessage.OPENWEATHER_API.LOCATION_FAILED} ${city}`
      );
    }

    const OPEN_WEATHER_URL = getOpenWeatherUrl(
      location[0].lat,
      location[0].lon
    );
    return (await fetchData(OPEN_WEATHER_URL)) as WeatherApiResponse;
  } catch (error) {
    throw new CustomError(
      400,
      `${ErrMessage.OPENWEATHER_API.FETCH_ERROR} ${error}`
    );
  }
};
