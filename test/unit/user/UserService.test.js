import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import User from "../../../src/models/User.model.js";
import UserService from "../../../src/services/UserService.js";

use(chaiAsPromised);

describe("User service tests: ", () => {
  let userService = null;
  let findByIdAndUpdateStub = null;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    userService = new UserService();
    findByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    userService = null;
    findByIdAndUpdateStub.restore();
  });

  describe("addLocationToFavourites tests: ", () => {
    //? US1-1
    it("should call findByIdAndUpdate on the user model with the correct arguments", async () => {
      //Arrange
      const originalUserDoc = { _id: "0" };
      const locationDoc = { _id: "1" };
      const expectedUpdateArg = {
        $push: { FavouriteLocations: locationDoc._id },
      };
      //Act
      await userService.addLocationToFavourites(originalUserDoc, locationDoc);
      const [receivedUserIdArg, receivedUpdateArg, receivedOptionsArg] =
        findByIdAndUpdateStub.getCall(0).args;
      //Assert
      expect(receivedUserIdArg).to.equal(originalUserDoc._id);
      expect(receivedUpdateArg).to.deep.equal(expectedUpdateArg);
      expect(receivedOptionsArg).to.deep.equal({ new: true });
    });

    //? US1-2
    it("should return the updated user document", async () => {
      //Arrange
      const originalUserDoc = { _id: "0" };
      const locationDoc = { _id: "1" };
      const expected = {};
      findByIdAndUpdateStub.resolves(expected);
      //Act
      const result = await userService.addLocationToFavourites(
        originalUserDoc,
        locationDoc
      );
      //Assert
      expect(result).to.equal(expected);
    });
  });
});
