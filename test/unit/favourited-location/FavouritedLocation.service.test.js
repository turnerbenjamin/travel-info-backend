import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import mongoose from "mongoose";
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
  let findOneStub = null;
  let createStub = null;
  let populateStub = null;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    favouritedLocationService = new FavouritedLocationService();
    findStub = sinon.stub(FavouritedLocation, "find");
    findOneStub = sinon.stub(FavouritedLocation, "findOne");
    createStub = sinon.stub(FavouritedLocation, "create");
    populateStub = sinon.stub(FavouritedLocation, "populate");
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    favouritedLocationService = null;
    findStub.restore();
    findOneStub.restore();
    createStub.restore();
    populateStub.restore();
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
    const testId = new mongoose.Types.ObjectId();
    let findByIdAndDeleteStub = null;

    //SET-UP USER SERVICE TESTS
    beforeEach(() => {
      findByIdAndDeleteStub = sinon.stub(
        FavouritedLocation,
        "findByIdAndDelete"
      );
    });

    //CLEAN-UP USER SERVICE TESTS
    afterEach(() => {
      findByIdAndDeleteStub.restore();
    });

    //? FLS3-1
    it("should call findByIdAndDelete on the FavouritedLocation model with the correct argument", async () => {
      //Arrange
      findByIdAndDeleteStub.resolves(favouritedLocationData.documents[0]);
      //Act
      await favouritedLocationService.deleteById(testId);
      const actualIdArgument = findByIdAndDeleteStub.getCall(0).args[0];
      //Assert
      expect(actualIdArgument).to.equal(testId);
    });

    //? FLS3-2
    it("should return deleted doc where one is returned", async () => {
      //Arrange
      const expected = favouritedLocationData.documents[0];
      findByIdAndDeleteStub.resolves(expected);
      //Act
      const actual = await favouritedLocationService.deleteById(testId);
      //Assert
      expect(actual).to.equal(expected);
    });

    //? FLS3-3
    it("should return undefined where no doc is returned", async () => {
      //Arrange
      findByIdAndDeleteStub.resolves(undefined);
      //Act
      const actual = await favouritedLocationService.deleteById(testId);
      //Assert
      expect(actual).to.equal(undefined);
    });

    //? FLS3-4
    it("should throw an error where findByIdAndDelete fails", async () => {
      findByIdAndDeleteStub.rejects();
      await expect(
        favouritedLocationService.deleteById(testId)
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
