import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import UserService from "../../../src/services/User.service.js";
import userData from "../../data/user.test.data.js";
import User from "../../../src/models/User.model.js";
import HTTPError from "../../../src/utils/HTTPError.js";

use(chaiAsPromised);

describe("User service tests: ", () => {
  let userService = null;
  let createStub = null;
  let findOneStub = null;
  let selectStub = null;
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    userService = new UserService();
    createStub = sinon.stub(User, "create");
    findOneStub = sinon.stub(User, "findOne");
    selectStub = sinon.stub();
    findOneStub.returns({ select: selectStub });
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    userService = null;
    createStub.restore();
    findOneStub.restore();
    selectStub = null;
  });

  describe("createUser tests: ", () => {
    //? AS4-1
    it("should call create on the user model with the correct arguments", async () => {
      //Arrange
      createStub.resolves(userData.documents[0]);
      //Act
      await userService.createUser(testUserEmail, testUserPassword);
      const [userObjArg] = createStub.getCall(0).args;
      //Assert
      expect(userObjArg).to.deep.equal(userData.submissions[0]);
    });

    //? AS4-2
    it("should throw a HTTPError with status of 400 where the email is a duplicate", async () => {
      //Arrange
      const expected = new HTTPError(
        400,
        "A user with this email already exists"
      );
      const duplicateKeyError = { code: 11000 };
      createStub.rejects(duplicateKeyError);
      let actual;
      //Act
      try {
        await userService.createUser(testUserEmail, testUserPassword);
      } catch (err) {
        actual = err;
      }
      //Assert
      expect(actual).to.deep.equal(expected);
    });

    //? AS4-3
    it("should throw a HTTPError with status of 500 for all other errors", async () => {
      //Arrange
      const expected = new HTTPError(500, "Server error");
      createStub.rejects(new Error());
      let actual;
      //Act
      try {
        await userService.createUser(testUserEmail, testUserPassword);
      } catch (err) {
        actual = err;
      }
      //Assert
      expect(actual).to.deep.equal(expected);
    });

    //? AS4-4
    it("should return the id of the new user", async () => {
      //Arrange
      createStub.resolves(userData.documents[0]);
      //Act
      const actualUserId = await userService.createUser(
        testUserEmail,
        testUserPassword
      );
      //Assert
      expect(actualUserId).to.equal(userData.documents[0]._id);
    });
  });

  describe("findByEmailAddress tests: ", () => {
    //? AS5-1
    it("should call findOne and select on the user model with the correct arguments", async () => {
      //Arrange
      const expectedFindOneArg = { emailAddress: testUserEmail };
      const expectedSelectArg = "+password";
      //Act
      await userService.findByEmailAddress(testUserEmail);
      //Assert
      const [actualFindOneArg] = findOneStub.getCall(0).args;
      const [actualSelectArg] = selectStub.getCall(0).args;
      //Assert
      expect(actualFindOneArg).to.deep.equal(expectedFindOneArg);
      expect(actualSelectArg).to.deep.equal(expectedSelectArg);
    });

    //? AS5-2
    it("should throw a HTTPError with status of 500 where findOne fails", async () => {
      //Arrange
      const expectedError = new HTTPError(500, "Server error");
      selectStub.rejects(new Error());
      let actualError;
      //Act
      try {
        await userService.findByEmailAddress(testUserEmail);
      } catch (err) {
        actualError = err;
      }
      //Assert
      expect(actualError.statusCode).to.equal(500);
    });
  });
});
