import { expect } from "chai";
import sinon from "sinon";

import LocationService from "../../../src/services/LocationService.js";
import Location from "../../../src/models/Location.model.js";

describe("Location service tests: ", () => {
  //SET-UP LOCATION SERVICE TESTS
  let locationService = null;
  let findOneLocationStub = null;
  let createLocationStub = null;

  beforeEach(() => {
    locationService = new LocationService();
    findOneLocationStub = sinon.stub(Location, "findOne");
    findOneLocationStub.resolves();
    createLocationStub = sinon.stub(Location, "create");
  });

  //CLEAN-UP LOCATION SERVICE TESTS
  afterEach(() => {
    locationService = null;
    findOneLocationStub = null;
    createLocationStub = null;
  });

  describe("addLocation tests: ", () => {
    //TEST DATA
    const testLocationBody = {
      label: "Peterborough",
      latitude: 52.56824186035162,
      longitude: -0.24517818700143068,
    };
    const testFormattedLocationObject = {
      label: testLocationBody.label,
      latAndLong: {
        type: "Point",
        coordinates: [testLocationBody.longitude, testLocationBody.latitude],
      },
      coordinateIdentifier: `${testLocationBody.latitude},${testLocationBody.longitude}`,
    };

    //? LS1-1
    it("should call findOne on the Location model with the correct coordinateIdentifier", async () => {
      //Arrange
      const expected = {
        coordinateIdentifier: testFormattedLocationObject.coordinateIdentifier,
      };
      //Act
      await locationService.addLocation(testLocationBody);
      //Assert
      expect(findOneLocationStub.calledWith(expected)).to.deep.equal;
    });
  });
});
