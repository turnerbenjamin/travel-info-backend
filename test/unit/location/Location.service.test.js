import chaiAsPromised from "chai-as-promised";
import { expect, use } from "chai";
import sinon from "sinon";

import Location from "../../../src/models/Location.model.js";
import LocationService from "../../../src/services/location.service.js";

import locationData from "../../data/location.test.data.js";

use(chaiAsPromised);

describe("Location service tests: ", () => {
  //SET-UP LOCATION SERVICE TESTS
  let locationService = null;
  let findOneLocationStub = null;
  let createLocationStub = null;

  beforeEach(() => {
    locationService = new LocationService();
    findOneLocationStub = sinon.stub(Location, "findOne");
    createLocationStub = sinon.stub(Location, "create");
  });

  //CLEAN-UP LOCATION SERVICE TESTS
  afterEach(() => {
    locationService = null;
    findOneLocationStub.restore();
    createLocationStub.restore();
  });

  describe("addLocation tests: ", () => {
    //TEST DATA
    //? LS1-1
    it("should call findOne on the Location model with the correct coordinate identifier as an argument", async () => {
      //Arrange
      const expected = {
        coordinateIdentifier: locationData.documents[0].coordinateIdentifier,
      };
      findOneLocationStub.resolves(locationData.documents[0]);
      //Act
      await locationService.addLocation(locationData.submissions[0]);
      const [result] = findOneLocationStub.getCall(0).args;
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? LS1-2
    it("should return correctly formatted response where a location with the same coordinates as those supplied is already in the collection", async () => {
      //Arrange
      const expected = locationData.formattedResponses[0];
      findOneLocationStub.resolves(locationData.documents[0]);
      //Act
      const result = await locationService.addLocation(
        locationData.submissions[0]
      );
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? LS1-3
    it("should throw an error if findOne fails", async () => {
      findOneLocationStub.rejects();
      await expect(
        locationService.addLocation(locationData.submissions[0])
      ).to.be.rejectedWith(Error);
    });

    //? LS1-4
    it("should call create with the correctly formatted location details on the Location model if findOne returns null", async () => {
      //Arrange
      findOneLocationStub.resolves(null);
      createLocationStub.resolves(locationData.documents[0]);
      const expected = { ...locationData.documents[0] };
      delete expected._id;
      //Act
      await locationService.addLocation(locationData.submissions[0]);
      const [result] = createLocationStub.getCall(0).args;
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? LS1-5
    it("should return a new location document with the correct properties where a location with the supplied coordinates was not already in the collection", async () => {
      //Arrange
      findOneLocationStub.resolves(null);
      createLocationStub.resolves(locationData.documents[0]);
      //Act
      const result = await locationService.addLocation(
        locationData.submissions[0]
      );

      //Assert
      expect(result).to.deep.equal(locationData.formattedResponses[0]);
    });

    //? LS1-6
    it("It should throw an error if create throws an error", async () => {
      //Arrange
      findOneLocationStub.resolves(null);
      createLocationStub.rejects();
      await expect(
        locationService.addLocation(locationData.submissions[0])
      ).to.be.rejectedWith(Error);
    });
  });
});
