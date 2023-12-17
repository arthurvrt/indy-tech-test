const fetchMock = jest.fn();

jest.mock("../../src/openWeather/openWeatherApi.ts", () => ({
  getWeather: jest.fn(),
}));

export default fetchMock;
