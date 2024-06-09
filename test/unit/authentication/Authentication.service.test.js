import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import AuthenticationService from "../../../src/services/Authentication.service.js";
import userData from "../../data/user.test.data.js";
import User from "../../../src/models/User.model.js";

use(chaiAsPromised);

describe("Authentication service tests: ", () => {
  let authenticationService = null;
  let createStub = null;
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    authenticationService = new AuthenticationService();
    createStub = sinon.stub(User, "create");
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    authenticationService = null;
    createStub.restore();
  });

  describe("createUser tests: ", () => {
    //? AS4-1
    it("should call create on the user model with the correct arguments", async () => {
      //Arrange
      createStub.resolves(userData.documents[0]);
      //Act
      await authenticationService.createUser(testUserEmail, testUserPassword);
      const [userObjArg] = createStub.getCall(0).args;
      //Assert
      expect(userObjArg).to.deep.equal(userData.submissions[0]);
    });
  });
});
