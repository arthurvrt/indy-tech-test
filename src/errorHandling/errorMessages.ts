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
  INPUT: {
    DATE: {
      AFTER_INVALID: "After date must be a string",
      BEFORE_INVALID: "Before date must be a string",
    },
    AGE: {
      EQ_INVALID: "Eq must be a number",
      LT_INVALID: "Lt must be a number",
      GT_INVALID: "Gt must be a number",
    },
    METEO: {
      IS_INDALID: "Is must be a string",
      TEMP_INVALID: "Temp must be an object",
      GT_INVALID: "Gt must be a number",
      LT_INVALID: "Lt must be a number",
    },
    RESTRICTION: {
      INVALID: "Restrictions must be an array",
    },
    AVANTAGE: {
      MSSING: "No avantage specified",
      INVALID: "Avantage must be a number",
    },
    NAME: {
      MISSING: "Promocode name is required",
      INVALID: "Promocode must be a string",
      ALREADY_EXISTS: "Promocode already exists",
    },
  },
} as const;
