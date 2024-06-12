import { expect } from "chai";
import sinon from "sinon";

import GeocodingController from "../../../src/controllers/GeocodingController.js";
import * as geocodingTestData from "../../data/geocoding.test.data.js";

describe("Geocoding Controller tests", () => {
  const testSearchTerm = "Dublin";
  let geocodingController;
  let geocodingService;
  let req;
  let res;

  beforeEach(() => {
    const getLocationsStub = sinon.stub();
    getLocationsStub.resolves(geocodingTestData.rawData);
    geocodingService = {
      getLocations: sinon.stub(),
    };
    geocodingController = new GeocodingController(geocodingService);
    req = {
      query: { searchTerm: testSearchTerm },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    geocodingService = null;
    geocodingController = null;
    req = null;
    res = null;
  });

  //? GC8-1
  it("should call get locations on the geocoding service with the correct arguments", async () => {
    //Act
    await geocodingController.getLocations(req, res);
    //Assert
    expect(geocodingService.getLocations.calledWith(testSearchTerm)).to.be.true;
  });

  //? GC8-2
  it("should respond with a status code of 500 if the geocoding service rejects", async () => {
    //Arrange
    geocodingService.getLocations.rejects();
    //Act
    await geocodingController.getLocations(req, res);
    //Assert
    expect(res.status.calledWith(500)).to.be.true;
  });

  //? GC8-3
  it("should respond with a status code of 200 if the geocoding service resolves", async () => {
    //Act
    await geocodingController.getLocations(req, res);
    //Assert
    expect(res.status.calledWith(200)).to.be.true;
  });
});
