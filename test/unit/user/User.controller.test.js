import sinon from "sinon";

import locationData from "../../data/location.test.data.js";
import UserController from "../../../src/controllers/User.controller.js";
import userData from "../../data/user.test.data.js";
import { expect } from "chai";

describe("User controller tests: ", () => {
  describe("addLocationToFavourites tests", () => {
    let userController;
    let locationService;
    let userService;
    let req;
    let res;

    beforeEach(() => {
      locationService = {
        addLocation: sinon.stub(),
      };
      userService = {
        addLocationToFavourites: sinon.stub(),
      };
      userController = new UserController(userService, locationService);
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
      userService = null;
      req = null;
      res = null;
    });

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
    it("should call add favourite location on user service object with the location document returned from the location service and req.user", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      //Act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(
        userService.addLocationToFavourites.calledWith(
          req.user,
          locationData.documents[0]
        )
      ).to.be.true;
    });

    //? UC1-6
    it("should send a 500 response if the user service throws an error", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      userService.addLocationToFavourites.rejects();
      //act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-7
    it("should send a 201 response if add favourite location resolves", async () => {
      //Arrange
      locationService.addLocation.resolves(locationData.documents[0]);
      userService.addLocationToFavourites.resolves(userData.documents[1]);
      //act
      await userController.addLocationToFavourites(req, res);
      //Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(userData.documents[1])).to.be.true;
    });
  });
});
