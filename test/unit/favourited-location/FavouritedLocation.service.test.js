import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import FavouritedLocation from "../../../src/models/FavouritedLocation.model.js";
import FavouritedLocationService from "../../../src/services/FavouritedLocation.service.js";
import locationData from "../../data/location.test.data.js";
import userData from "../../data/user.test.data.js";

use(chaiAsPromised);

describe("Favourited location service tests: ", () => {
  let favouritedLocationService = null;
  let findStub = null;
  let createStub = null;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    favouritedLocationService = new FavouritedLocationService();
    findStub = sinon.stub(FavouritedLocation, "find");
    createStub = sinon.stub(FavouritedLocation, "create");
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    favouritedLocationService = null;
    findStub.restore();
    createStub.restore();
  });

  describe("addLocationToFavourites tests: ", () => {
    //? FLS1-1
    it("should call find on the FavouritedLocation model with the userId as an argument", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      const expected = { user: testUser._id };
      //Act
      await favouritedLocationService.addFavourite(testUser, testLocation);
      const [result] = findStub.getCall(0).args;
      //Assert
      expect(result).to.deep.equal(expected);
    });
  });
});
