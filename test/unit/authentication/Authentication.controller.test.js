import { expect } from "chai";
import bcrypt from "bcrypt";
import sinon from "sinon";

import AuthenticationController from "../../../src/controllers/Authentication.controller.js";
import userData from "../../data/user.test.data.js";

describe("User controller tests: ", () => {
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;
  const testHashedPassword = "hashedPassword";
  let authenticationController;
  let userService;
  let hashStub;
  let req;
  let res;

  beforeEach(() => {
    hashStub = sinon.stub(bcrypt, "hash");
    hashStub.resolves(testHashedPassword);
    userService = {
      createUser: sinon.stub(),
    };

    authenticationController = new AuthenticationController(userService);
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
    hashStub.restore();
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

    //? AC4-2
    it("should pass the user email and hashed password to create user on the User service", async () => {
      //Act
      await authenticationController.register(req, res);
      const [actualEmailAddressArg, actualHashedPasswordArg] =
        userService.createUser.getCall(0).args;
      //Assert
      expect(actualEmailAddressArg).to.equal(testUserEmail);
      expect(actualHashedPasswordArg).to.equal(testHashedPassword);
    });
  });
});
