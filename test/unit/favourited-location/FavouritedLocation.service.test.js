import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import FavouritedLocation from "../../../src/models/FavouritedLocation.model.js";
import FavouritedLocationService from "../../../src/services/FavouritedLocation.service.js";
import favouritedLocationData from "../../data/favouritedLocation.test.data.js";
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

  describe("addFavourite tests: ", () => {
    //? FLS1-1
    it("should call find on the FavouritedLocation model with the userId as an argument", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findStub.resolves(favouritedLocationData.documents);
      const expected = { user: testUser._id };
      //Act
      await favouritedLocationService.addFavourite(testUser, testLocation);
      const [result] = findStub.getCall(0).args;
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS1-2
    it("should return an array of favourited locations for the user where location already in the user's favourites", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      const expected = favouritedLocationData.documents;
      findStub.resolves(expected);
      //Act
      const result = await favouritedLocationService.addFavourite(
        testUser,
        testLocation
      );
      //Assert
      expect(result).to.equal(expected);
    });

    //? FLS1-3
    it("should call create on the FavouritedLocation model with the correct arguments if the location has not in the user's favourited locations", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findStub.resolves(favouritedLocationData.documents[1]);
      //Act
      await favouritedLocationService.addFavourite(testUser, testLocation);
      const { user: userIdArg, location: locationIdArg } =
        createStub.getCall(0).args[0];
      //Assert
      expect(userIdArg).to.equal(testUser._id);
      expect(locationIdArg).to.equal(testLocation._id);
    });
  });
});
