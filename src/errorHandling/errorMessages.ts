export const ErrMessage = {
  DATE: {
    INVALID: "Invalid date",
    FORMAT: "Must be a correct formated string",
  },
  AGE: {
    MISSING: "Missing age",
    INVALID_EQ: "Invalid age:eq",
    INVALID_LT: "Invalid age:lt",
    INVALID_GT: "Invalid age:gt",
    FORMAT: "Age must be a number",
  },
  LOCATION: {
    NO_SPECIFIED: "No location specified",
  },
  METEO: {
    IS_INVALID: "Invalid meteo:is",
    TEMP_GT_INVALID: "Invalid meteo:temp:gt",
    TEMP_LT_INVALID: "Invalid meteo:temp:lt",
    FORMAT: "Meteo must be an object containing a key town with a value string",
  },
  OPENWEATHER_API: {
    FETCH_ERROR: "Error fetching weather data",
    MISSING: "OpenWeather API key is not set.",
    GEOCING_ERROR: "Geocoding API error! Status:",
    GEOCODING_FAILED: "Failed to fetch location data: ",
    LOCATION_FAILED: "No location data found for",
  },
  CODE: {
    MISSING: "Missing code",
  },
} as const;
