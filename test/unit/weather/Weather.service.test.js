import { expect } from "chai";
import axios from "axios";
import sinon from "sinon";

import weatherServiceTestData from "../../data/weatherService.test.data.js";
import WeatherService from "../../../src/services/Weather.service.js";

describe("Weather Service tests", () => {
  const testLatitude = 51.5073219;
  const testLongitude = -0.1276474;
  let axiosGetStub;
  let weatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
    axiosGetStub = sinon.stub(axios, "get");
    axiosGetStub.resolves({ data: weatherServiceTestData });
  });

  afterEach(() => {
    axiosGetStub.restore();
    weatherService = null;
  });

  //? WS9-1
  it("should call get on Axios with a valid url", async () => {
    //Arrange
    const expectedURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${testLatitude}&lon=${testLongitude}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    //Act
    await weatherService.getWeather(testLatitude, testLongitude);
    //Assert
    expect(axiosGetStub.calledWith(expectedURL)).to.be.true;
  });

  //? WS9-2
  it("should throw a HTTPError with status of 500 where Axios rejects", async () => {
    //Arrange
    axiosGetStub.rejects();
    let expected = 500;
    let actual;
    //Act
    try {
      await weatherService.getWeather(testLatitude, testLongitude);
    } catch (err) {
      actual = err.statusCode;
    }
    //Assert
    expect(actual).to.equal(expected);
  });

  //? WS9-3
  it("should return a weather forecast object", async () => {
    //Act
    const actual = await weatherService.getWeather(testLatitude, testLongitude);
    //Assert
    expect(actual).to.equal(weatherServiceTestData);
  });
});
