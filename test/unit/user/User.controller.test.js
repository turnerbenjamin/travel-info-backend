import mongoose from "mongoose";
import sinon from "sinon";

import favouritedLocationData from "../../data/favouritedLocation.test.data.js";
import locationData from "../../data/location.test.data.js";
import UserController from "../../../src/controllers/User.controller.js";
import userData from "../../data/user.test.data.js";
import { expect } from "chai";

describe("User controller tests: ", () => {
  let userController;
  let locationService;
  let favouriteLocationService;
  let req;
  let res;

  beforeEach(() => {
    locationService = {
      addLocation: sinon.stub(),
    };
    favouriteLocationService = {
      addFavourite: sinon.stub(),
      getUserFavourites: sinon.stub(),
      deleteById: sinon.stub(),
    };
    userController = new UserController(
      favouriteLocationService,
      locationService
    );
    req = {
      body: locationData.submissions[0],
      user: userData.documents[0],
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    locationService = null;
    favouriteLocationService = null;
    req = null;
    res = null;
  });

  describe("addLocationToFavourites tests", () => {
    //? UC1-1
    it("should call add location on location service with the correct location details", async () => {
      userController.addLocationToFavourites(req, res);
      expect(locationService.addLocation.calledWith(req.body)).to.be.true;
    });

    //? UC1-2
    it("should send a 500 response if the location service throws an error", async () => {
      //Arrange
      locationService.addLocation.rejects();
      //Act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-3
    it("should send a 500 response if req.user is null", async () => {
      //Arrange
      req.user = null;
      //act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-4
    it("should send a 400 response if req.body is null", async () => {
      //Arrange
      req.body = null;
      //Act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-5
    it("should call add favourite on favourite location service object with the location document returned from the location service and req.user", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      //Act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(
        favouriteLocationService.addFavourite.calledWith(
          req.user,
          locationData.documents[0]
        )
      ).to.be.true;
    });

    //? UC1-6
    it("should send a 500 response if the favourite location service throws an error", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      favouriteLocationService.addFavourite.rejects();
      //act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-7
    it("should send a 201 response if add location resolves", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      favouriteLocationService.addFavourite.resolves(locationData.documents);
      //act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(locationData.documents)).to.be.true;
    });
  });

  describe("getFavourites tests", () => {
    //? UC2-1
    it("should call getUserFavourites on the Favourited Location service with the correct argument", async () => {
      //Arrange
      favouriteLocationService.getUserFavourites.resolves(
        favouritedLocationData.formattedResponse
      );
      //act
      await userController.getUserFavouriteLocations(req, res);
      //Assert
      expect(favouriteLocationService.getUserFavourites.calledWith(req.user)).to
        .be.true;
    });

    //? UC2-2
    it("should send a 500 response if the Favourited Location service rejects", async () => {
      //Arrange
      favouriteLocationService.getUserFavourites.rejects();
      //act
      await userController.getUserFavouriteLocations(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? UC2-3
    it("should send a 500 response if req.user is null", async () => {
      //Arrange
      favouriteLocationService.getUserFavourites.resolves(
        favouritedLocationData.formattedResponse
      );
      req.user = null;
      //act
      await userController.getUserFavouriteLocations(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? UC2-4
    it("should send a 200 response if getUserFavourites resolves", async () => {
      //Arrange
      favouriteLocationService.getUserFavourites.resolves(
        favouritedLocationData.formattedResponse
      );
      //act
      await userController.getUserFavouriteLocations(req, res);
      //Assert
      expect(res.status.calledWith(200)).to.be.true;
    });

    //? UC2-5
    it("should call res.json with value returned from getUserFavourites", async () => {
      //Arrange
      const expected = favouritedLocationData.formattedResponse;
      favouriteLocationService.getUserFavourites.resolves(expected);
      //act
      await userController.getUserFavouriteLocations(req, res);
      //Assert
      expect(res.json.calledWith(expected)).to.be.true;
    });
  });
  describe("deleteById tests", () => {
    const testId = new mongoose.Types.ObjectId();
    beforeEach(() => {
      req.params = { id: testId.toString() };
    });

    //? UC3-1
    it("should call deleteById on the Favourited Location service with the correct id", async () => {
      //Arrange
      favouriteLocationService.deleteById.resolves(
        favouritedLocationData.documents[0]
      );
      //act
      await userController.deleteById(req, res);
      //Assert
      expect(favouriteLocationService.deleteById.calledWith(testId.toString()))
        .to.be.true;
    });
  });
});
