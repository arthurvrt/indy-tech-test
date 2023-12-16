import { GeocodingApiResponse, WeatherApiResponse } from "./openWeatherTypes";
import fetch from "node-fetch";

const LIMIT = 1 as const;

const ensureApiKey = (): string => {
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API key is not set.");
  }
  return apiKey;
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
    const response = await fetch(GEOCODING_URL);
    if (!response.ok) {
      throw new Error(`Geocoding API error! Status: ${response.status}`);
    }
    const geocodingData: GeocodingApiResponse[] =
      (await response.json()) as GeocodingApiResponse[];
    return geocodingData;
  } catch (error) {
    throw new Error(`Failed to fetch location data: ${error}`);
  }
};

export const getWeather = async (city: string): Promise<WeatherApiResponse> => {
  try {
    const location = await getLocation(city);
    if (location.length === 0) {
      throw new Error(`No location data found for ${city}`);
    }

    const OPEN_WEATHER_URL = getOpenWeatherUrl(
      location[0].lat,
      location[0].lon
    );
    const weatherResponse = await fetch(OPEN_WEATHER_URL);

    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
    }
    const weatherData: WeatherApiResponse =
      (await weatherResponse.json()) as WeatherApiResponse;
    return weatherData;
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error}`);
  }
};
