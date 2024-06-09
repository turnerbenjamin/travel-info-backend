import { expect } from "chai";
import bcrypt from "bcrypt";
import sinon from "sinon";

import AuthenticationController from "../../../src/controllers/Authentication.controller.js";
import userData from "../../data/user.test.data.js";

describe("User controller tests: ", () => {
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;
  let authenticationController;
  let userService;
  let hashStub;
  let req;
  let res;

  beforeEach(() => {
    hashStub = sinon.stub(bcrypt, "hash");
    authenticationController = new AuthenticationController();
    req = {
      body: userData.submissions[0],
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    authenticationController = null;
    userService = null;
    hashStub = null;
    req = null;
    res = null;
  });

  describe("register user tests", () => {
    //? AC4-1
    it("should call hash on bcrypt with the password", async () => {
      //Arrange
      const expectedPasswordToHash = testUserPassword;
      const expectedSalts = 10;
      //Act
      await authenticationController.register(req, res);
      const [actualPasswordToHash, actualSalts] = hashStub.getCall(0).args;
      //Assert
      expect(actualPasswordToHash).to.equal(expectedPasswordToHash);
      expect(actualSalts).to.equal(expectedSalts);
    });
  });
});
