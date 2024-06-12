import axios from "axios";
import sinon from "sinon";
import GeocodingService from "../../../src/services/GeocodingService.js";
import { expect } from "chai";

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
    const expectedURL = `https://api.openweathermap.org/geo/1.0/direct?q=${testSearchTerm},,GB&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    //Act
    await geocodingService.getLocations(testSearchTerm);
    //Assert
    expect(axiosGetStub.calledWith(expectedURL)).to.be.true;
  });
});
