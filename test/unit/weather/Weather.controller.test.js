import { expect } from "chai";
import sinon from "sinon";

import WeatherController from "../../../src/controllers/Weather.controller.js";
import weatherTestData from "../../data/weatherService.test.data.js";

describe("Geocoding Controller tests", () => {
  const testLatitude = 51.5073219;
  const testLongitude = -0.1276474;
  let weatherController;
  let weatherService;
  let req;
  let res;

  beforeEach(() => {
    const getWeatherStub = sinon.stub();
    getWeatherStub.resolves(weatherTestData);
    weatherService = {
      getWeather: getWeatherStub,
    };
    weatherController = new WeatherController(weatherService);
    req = {
      query: { latitude: testLatitude, longitude: testLongitude },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    weatherService = null;
    weatherController = null;
    req = null;
    res = null;
  });

  //? WC9-1
  it("should call get weather on the weather service with the correct arguments", async () => {
    //Act
    await weatherController.getWeather(req, res);
    //Assert
    expect(weatherService.getWeather.calledWith(testLatitude, testLongitude)).to
      .be.true;
  });

  //? WC9-2
  it("should respond with a status code of 500 if the weather service rejects", async () => {
    const expected = 500;
    let actual;
    weatherService.getWeather.rejects();
    //Act
    try {
      await weatherController.getWeather(req, res);
    } catch (err) {
      actual = err.statusCode;
    }
    //Assert
    expect(actual).to.equal(expected);
  });
});