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
        addLocation: sinon.stub(),
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
      userController.addLocationToFavourites(req, res);
      expect(locationService.addLocation.calledWith(req.body)).to.be.true;
    });

    //? UC1-2
    it("should send a 500 response if the location service throws an error", async () => {
      //Arrange
      locationService.addLocation.rejects();
      //act
      await userController.addLocationToFavourites(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    //? UC1-3
    it("should send a 500 response if req.user is null", async () => {
      //Arrange
      req.user = null;
      //act
      await userController.addLocationToFavourites(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
