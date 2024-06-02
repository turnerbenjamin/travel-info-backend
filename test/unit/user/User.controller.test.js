import sinon from "sinon";

import locationData from "../../data/location.test.data.js";
import UserController from "../../../src/controllers/User.controller.js";
import userData from "../../data/user.test.data.js";
import { expect } from "chai";

describe("User controller tests: ", () => {
  describe("addLocationToFavourites tests", () => {
    let userController;
    let locationService;
    let req;
    let res;

    beforeEach(() => {
      locationService = {
        addLocation: sinon.spy(),
      };
      userController = new UserController(locationService);
      req = {
        body: locationData.submissions[0],
        user: userData.documents[0],
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });
    //? UC1-1
    it("should call add location on location service with the correct location details", async () => {
      //Arrange

      //Act
      userController.addLocationToFavourites(req, res);
      //Assert
      expect(locationService.addLocation.calledWith(req.body)).to.be.true;
    });
  });
});
