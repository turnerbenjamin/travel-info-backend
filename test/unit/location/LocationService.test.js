import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import LocationService from "../../../src/services/LocationService.js";
import Location from "../../../src/models/Location.model.js";

use(chaiAsPromised);

describe("Location service tests: ", () => {
  //SET-UP LOCATION SERVICE TESTS
  let locationService = null;
  let findOneLocationStub = null;
  let createLocationStub = null;
  findOneLocationStub = sinon.stub(Location, "findOne");
  createLocationStub = sinon.stub(Location, "create");

  beforeEach(() => {
    locationService = new LocationService();
  });

  //CLEAN-UP LOCATION SERVICE TESTS
  afterEach(() => {
    locationService = null;
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
      const result = findOneLocationStub.getCall(0).args[0];
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? LS1-2
    it("should return the correct location where a location with the same coordinates as those supplied is already in the collection", async () => {
      //Arrange
      const expected = testFormattedLocationObject;
      findOneLocationStub.resolves(expected);
      //Act
      const result = await locationService.addLocation(testLocationBody);
      //Assert
      expect(result).to.equal(expected);
    });

    //? LS1-3
    it("It should throw an error if findOne fails", async () => {
      findOneLocationStub.rejects();
      await expect(
        locationService.addLocation(testLocationBody)
      ).to.be.rejectedWith(Error);
    });
  });
});
