import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import mongoose from "mongoose";
import sinon from "sinon";

import FavouritedLocation from "../../../src/models/FavouritedLocation.model.js";
import FavouritedLocationService from "../../../src/services/FavouritedLocation.service.js";
import favouritedLocationData from "../../data/favouritedLocation.test.data.js";
import locationData from "../../data/location.test.data.js";
import userData from "../../data/user.test.data.js";
import HTTPError from "../../../src/utils/HTTPError.js";

use(chaiAsPromised);

describe("Favourited location service tests: ", () => {
  let favouritedLocationService = null;
  let findStub = null;
  let findOneStub = null;
  let createStub = null;
  let populateStub = null;
  let findOneAndDeleteStub = null;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    favouritedLocationService = new FavouritedLocationService();
    findStub = sinon.stub(FavouritedLocation, "find");
    findOneStub = sinon.stub(FavouritedLocation, "findOne");
    createStub = sinon.stub(FavouritedLocation, "create");
    populateStub = sinon.stub(FavouritedLocation, "populate");
    findOneAndDeleteStub = sinon.stub(FavouritedLocation, "findOneAndDelete");
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    favouritedLocationService = null;
    findStub.restore();
    findOneStub.restore();
    createStub.restore();
    populateStub.restore();
    findOneAndDeleteStub.restore();
  });

  describe("addFavourite tests: ", () => {
    //? FLS1-1
    it("should call findOne on the FavouritedLocation model with the correct argument", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findOneStub.resolves(favouritedLocationData.documents[0]);
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      const expected = { user: testUser._id, location: testLocation._id };
      //Act
      await favouritedLocationService.addFavourite(testUser, testLocation);
      const [result] = findOneStub.getCall(0).args;
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS1-2
    it("should return an array of favourited locations for the user where location already in the user's favourites", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      const expected = favouritedLocationData.formattedResponse;
      findOneStub.resolves(favouritedLocationData.documents[0]);
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      //Act
      const result = await favouritedLocationService.addFavourite(
        testUser,
        testLocation
      );
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS1-3
    it("should call create on the FavouritedLocation model with the correct arguments if the location has not in the user's favourited locations", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      //Act
      await favouritedLocationService.addFavourite(testUser, testLocation);
      const { user: userIdArg, location: locationIdArg } =
        createStub.getCall(0).args[0];
      //Assert
      expect(userIdArg).to.equal(testUser._id);
      expect(locationIdArg).to.equal(testLocation._id);
    });

    //? FLS1-4
    it("should return an array of favourited locations for the user where location not already in the user's favourites", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      const expected = favouritedLocationData.formattedResponse;
      findOneStub.resolves(null);
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      //Act
      const result = await favouritedLocationService.addFavourite(
        testUser,
        testLocation
      );
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS1-5
    it("should throw an error where findOne fails", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findOneStub.rejects();
      //Assert
      await expect(
        favouritedLocationService.addFavourite(testUser, testLocation)
      ).to.be.rejectedWith(Error);
    });

    //? FLS1-6
    it("should throw an error where find fails", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findOneStub.resolves(favouritedLocationData.documents[0]);
      findStub.rejects();
      //Assert
      await expect(
        favouritedLocationService.addFavourite(testUser, testLocation)
      ).to.be.rejectedWith(Error);
    });

    //? FLS1-7
    it("should throw an error where create fails", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const testLocation = locationData.documents[0];
      findOneStub.resolves(null);
      createStub.rejects();
      findStub.resolves();
      //Assert
      await expect(
        favouritedLocationService.addFavourite(testUser, testLocation)
      ).to.be.rejectedWith(Error);
    });
  });

  describe("getFavourites tests: ", () => {
    //? FLS2-1
    it("should call find on the FavouritedLocation model with the correct argument", async () => {
      //Arrange
      const testUser = userData.documents[0];
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      const expectedQuery = { user: testUser._id };
      //Act
      await favouritedLocationService.getUserFavourites(testUser);
      const actualQuery = findStub.getCall(0).args[0];
      //Assert
      expect(actualQuery).to.deep.equal(expectedQuery);
    });

    //? FLS2-2
    it("should return an array of favourited locations for the user where locations exist", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const expected = favouritedLocationData.formattedResponse;
      populateStub.resolves(favouritedLocationData.populatedDocuments);
      findStub.returns({ populate: populateStub });
      //Act
      const result = await favouritedLocationService.getUserFavourites(
        testUser
      );
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS2-3
    it("should return an empty array where no locations exist", async () => {
      //Arrange
      const testUser = userData.documents[0];
      const expected = [];
      populateStub.resolves([]);
      findStub.returns({ populate: populateStub });
      //Act
      const result = await favouritedLocationService.getUserFavourites(
        testUser
      );
      //Assert
      expect(result).to.deep.equal(expected);
    });

    //? FLS2-4
    it("should throw an error where find fails", async () => {
      //Arrange
      const testUser = userData.documents[0];
      findStub.rejects();
      //Assert
      await expect(
        favouritedLocationService.getUserFavourites(testUser)
      ).to.be.rejectedWith(Error);
    });
  });

  describe("deleteById Tests: ", () => {
    const testFavouritedLocation = favouritedLocationData.documents[0];
    const testFavouritedLocationId = testFavouritedLocation._id;
    const testUser = userData.documents[0];

    //? FLS3-1
    it("should call findOneAndDelete on the FavouritedLocation model with the correct arguments", async () => {
      //Arrange
      const expectedArgument = {
        user: testUser._id,
        _id: testFavouritedLocationId,
      };
      findOneAndDeleteStub.resolves(testFavouritedLocation);
      //Act
      await favouritedLocationService.deleteById(
        testUser,
        testFavouritedLocationId
      );
      const actualArgument = findOneAndDeleteStub.getCall(0).args[0];
      //Assert
      expect(actualArgument).to.deep.equal(expectedArgument);
    });

    //? FLS3-2
    it("should return undefined where a deleted doc is returned", async () => {
      //Arrange
      findOneAndDeleteStub.resolves(testFavouritedLocation);
      //Act
      const actual = await favouritedLocationService.deleteById(
        testUser,
        testFavouritedLocationId
      );
      //Assert
      expect(actual).to.equal(undefined);
    });

    //? FLS3-3
    it("should throw HTTPError with status of 404 where no deleted doc is returned", async () => {
      //Arrange
      const expected = new HTTPError(404, "Favourited location not found");
      findOneAndDeleteStub.resolves(undefined);
      let actual;
      //Act
      try {
        await favouritedLocationService.deleteById(
          testUser,
          testFavouritedLocationId
        );
      } catch (err) {
        actual = err;
      }
      //Assert
      expect(actual).to.deep.equal(expected);
    });

    //? FLS3-4
    it("should throw an error where findByIdAndDelete fails", async () => {
      findOneAndDeleteStub.rejects();
      await expect(
        favouritedLocationService.deleteById(testUser, testFavouritedLocationId)
      ).to.be.rejectedWith(Error);
    });

    //? FLS3-5
    it("should throw an error where passed id is undefined", async () => {
      await expect(
        favouritedLocationService.deleteById(undefined)
      ).to.be.rejectedWith(Error);
    });
  });
});
