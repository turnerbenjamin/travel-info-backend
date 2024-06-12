import { expect } from "chai";
import axios from "axios";
import sinon from "sinon";

import GeocodingService from "../../../src/services/GeocodingService.js";
import * as geocodingTestData from "../../data/geocoding.test.data.js";

describe("Geocoding Service tests", () => {
  const testSearchTerm = "Dublin";
  let axiosGetStub;
  let geocodingService;

  beforeEach(() => {
    geocodingService = new GeocodingService();
    axiosGetStub = sinon.stub(axios, "get");
  });

  afterEach(() => {
    axiosGetStub.restore();
  });

  //?GS8-1
  it("should call get on Axios with a valid url", async () => {
    //Arrange
    axiosGetStub.resolves({ data: geocodingTestData.rawData });
    const expectedURL = `https://api.openweathermap.org/geo/1.0/direct?q=${testSearchTerm},,GB&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    //Act
    await geocodingService.getLocations(testSearchTerm);
    //Assert
    expect(axiosGetStub.calledWith(expectedURL)).to.be.true;
  });

  //?GS8-2
  it("should throw a HTTPError with status of 500 where Axios rejects", async () => {
    //Arrange
    axiosGetStub.rejects();
    const expected = 500;
    let actual;
    //Act
    try {
      await geocodingService.getLocations(testSearchTerm);
    } catch (err) {
      actual = err.statusCode;
    }
    //Assert
    expect(actual).to.equal(expected);
  });

  //?GS8-3
  it("should return an array of location objects", async () => {
    //Arrange
    axiosGetStub.resolves({ data: geocodingTestData.rawData });
    //Act
    const actual = await geocodingService.getLocations(testSearchTerm);
    //Assert
    expect(actual).to.equal(geocodingTestData.rawData);
  });
});
