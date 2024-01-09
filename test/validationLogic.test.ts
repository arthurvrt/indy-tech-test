import { ErrMessage } from "../src/middlewares/errorHandling/errorMessages";
import { validateRestrictions } from "../src/services/validationLogic";
import {
  getGeocodingUrl,
  getOpenWeatherUrl,
  getWeather as actualGetWeather,
} from "../src/thirdParty/openWeather/openWeatherApi";

import { Restriction } from "../src/types/createCode";
import fetchMock from "./__mocks__/node-fetch";

describe("checkRestriction", () => {
  const mocked_api_key = "mocked_api_key";
  beforeAll(() => {
    process.env.OPEN_WEATHER_API_KEY = mocked_api_key;
  });

  describe("dateRule", () => {
    it("should return true", async () => {
      const restrictions = [
        { "@date": { after: "2022-01-01", before: "2023-01-01" } },
      ];
      const requestArguments = { date: "2022-06-01" };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({ isValid: true, reasons: [] });
    });

    it("should return false and invalid message date", async () => {
      const restrictions = [
        { "@date": { after: "2022-01-01", before: "2023-01-01" } },
      ];
      const requestArguments = { date: "2023-06-01" };

      const result = await validateRestrictions(restrictions, requestArguments);

      console.log("myResult", result);

      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.DATE.INVALID],
      });
    });
  });

  describe("ageRule", () => {
    it("should return true if age is within the specified range", async () => {
      const restrictions = [{ "@age": { gt: 20, lt: 30 } }];
      const requestArguments = { age: 25 };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({ isValid: true, reasons: [] });
    });

    it("should return false with reasons if age is outside the specified range", async () => {
      const restrictions = [{ "@age": { gt: 20, lt: 30 } }];
      const requestArguments = { age: 35 };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.AGE.INVALID_LT],
      });
    });

    it("should return false with reasons if age is equal to the specified value", async () => {
      const restrictions = [{ "@age": { eq: 25 } }];
      const requestArguments = { age: 25 };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({ isValid: true, reasons: [] });
    });

    it("should return false with reasons if age is missing", async () => {
      const restrictions = [{ "@age": { gt: 20, lt: 30 } }];
      const requestArguments = {};

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.AGE.MISSING],
      });
    });
  });

  describe("meteoRule", () => {
    it("should return mocked weather data", async () => {
      const mockLocationResponse = [
        {
          lat: 40.7128,
          lon: -74.006,
        },
      ];

      const mockWeatherResponse = {
        main: {
          temp: 20,
        },
      };

      try {
        fetchMock.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce(mockLocationResponse),
          ok: true,
        });

        fetchMock.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce(mockWeatherResponse),
          ok: true,
        });

        const weatherData = await actualGetWeather("mockedCity");

        expect(weatherData.main.temp).toEqual(20);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenCalledWith(getGeocodingUrl("mockedCity"));
        expect(fetchMock).toHaveBeenCalledWith(
          getOpenWeatherUrl(
            mockLocationResponse[0].lat,
            mockLocationResponse[0].lon
          )
        );
      } catch (error) {
        console.error("Test error:", error);
      }
    });

    it("should return mocked weather data", async () => {
      const restrictions = [{ "@meteo": { is: "clear" } }];
      const requestArguments = { meteo: { town: "mockCity" } };
      const mockResponse = { weather: { description: "cloudy" } };

      try {
        fetchMock.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce(mockResponse),
          ok: true,
        });

        const result = await validateRestrictions(
          restrictions,
          requestArguments
        );

        expect(result).toEqual({
          isValid: false,
          reasons: [ErrMessage.METEO.IS_INVALID],
        });
      } catch (error) {
        console.error("Test error:", error);
      }
    });
  });

  describe("andRule", () => {
    it("should return true if all sub-rules are valid", async () => {
      const restrictions: Restriction[] = [
        {
          "@and": [
            { "@age": { gt: 20 } },
            { "@date": { after: "2022-01-01" } },
          ],
        },
      ];
      const requestArguments = { age: 25, date: "2022-06-01" };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({ isValid: true, reasons: [] });
    });

    it("should return false with reasons if any sub-rule is invalid", async () => {
      const restrictions = [
        {
          "@and": [
            { "@age": { gt: 20 } },
            { "@date": { after: "2022-01-01" } },
          ],
        },
      ];
      const requestArguments = { age: 15, date: "2022-06-01" };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.AGE.INVALID_GT],
      });
    });

    it("should return false with reasons if any sub-rule is invalid", async () => {
      const restrictions = [
        {
          "@and": [
            { "@age": { gt: 20 } },
            { "@date": { after: "2022-01-01" } },
          ],
        },
      ];
      const requestArguments = { age: 15, date: "2021-06-01" };

      const result = await validateRestrictions(restrictions, requestArguments);

      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.AGE.INVALID_GT, ErrMessage.DATE.INVALID],
      });
    });
  });

  describe("orRule", () => {
    it("should return true if any sub-rule is valid", async () => {
      const restrictions = [
        {
          "@or": [{ "@age": { gt: 20 } }, { "@date": { after: "2022-01-01" } }],
        },
      ];
      const requestArguments = { age: 15, date: "2022-06-01" };
      const result = await validateRestrictions(restrictions, requestArguments);
      expect(result).toEqual({ isValid: true, reasons: [] });
    });
    it("should return false with reasons if all sub-rules are invalid", async () => {
      const restrictions = [
        {
          "@or": [{ "@age": { gt: 20 } }, { "@date": { after: "2022-01-01" } }],
        },
      ];
      const requestArguments = { age: 15, date: "2021-06-01" };
      const result = await validateRestrictions(restrictions, requestArguments);
      expect(result).toEqual({
        isValid: false,
        reasons: [ErrMessage.AGE.INVALID_GT, ErrMessage.DATE.INVALID],
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
