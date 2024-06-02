import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import locationData from "../../data/location.test.data.js";
import User from "../../../src/models/User.model.js";
import UserService from "../../../src/services/User.service.js";
import userData from "../../data/user.test.data.js";

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

      const expectedUpdateArg = {
        $push: { FavouriteLocations: locationData.documents[0]._id },
      };
      //Act
      await userService.addLocationToFavourites(
        userData.documents[0],
        locationData.documents[0]
      );
      const [receivedUserIdArg, receivedUpdateArg, receivedOptionsArg] =
        findByIdAndUpdateStub.getCall(0).args;
      //Assert
      expect(receivedUserIdArg).to.equal(userData.documents[0]._id);
      expect(receivedUpdateArg).to.deep.equal(expectedUpdateArg);
      expect(receivedOptionsArg).to.deep.equal({ new: true });
    });

    //? US1-2
    it("should return the updated user document", async () => {
      //Arrange
      const expected = userData.documents[1];
      findByIdAndUpdateStub.resolves(expected);
      //Act
      const result = await userService.addLocationToFavourites(
        userData.documents[0],
        locationData.documents[0]
      );
      //Assert
      expect(result).to.equal(expected);
    });

    //? US1-3
    it("should throw an error where findByIdAndUpdate fails", async () => {
      findByIdAndUpdateStub.rejects();
      await expect(
        userService.addLocationToFavourites(
          userData.documents[0],
          locationData.documents[0]
        )
      ).to.be.rejectedWith(Error);
    });
  });
});
