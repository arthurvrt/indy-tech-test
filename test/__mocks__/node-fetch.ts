const fetchMock = jest.fn();

jest.mock("../../src/thirdParty/openWeather/openWeatherApi.ts", () => ({
  getWeather: jest.fn(),
}));

export default fetchMock;
