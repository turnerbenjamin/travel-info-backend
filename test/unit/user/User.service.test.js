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
  let findByIdStub = null;
  let findByIdAndUpdateStub = null;
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;
  const testId = userData.documents[0]._id.toString();

  //SET-UP USER SERVICE TESTS
  beforeEach(() => {
    userService = new UserService();
    createStub = sinon.stub(User, "create");
    findOneStub = sinon.stub(User, "findOne");
    findByIdStub = sinon.stub(User, "findById");
    findByIdAndUpdateStub = sinon.stub(User, "findByIdAndUpdate");
    selectStub = sinon.stub();
    findOneStub.returns({ select: selectStub });
    findByIdStub.returns({ select: selectStub });
  });

  //CLEAN-UP USER SERVICE TESTS
  afterEach(() => {
    userService = null;
    createStub.restore();
    findOneStub.restore();
    findByIdStub.restore();
    findByIdAndUpdateStub.restore();
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

    //? AS5-3
    it("should return the new user", async () => {
      //Arrange
      const testDoc = userData.documents[0];
      selectStub.resolves(testDoc);
      //Act

      const response = await userService.findByEmailAddress(testUserEmail);

      //Assert
      expect(response).to.equal(testDoc);
    });
  });
  describe("findById tests: ", () => {
    //? US6-1
    it("Should call findById on User with correct argument", async () => {
      //Arrange

      //Act
      await userService.findById(testId);
      const [actualIdArg] = findByIdStub.getCall(0).args;
      //Assert
      expect(actualIdArg).to.equal(testId);
    });

    //? US6-2
    it("should throw HTTPError with status of 500 is findById rejects", async () => {
      //Arrange

      findByIdStub.rejects();
      let actual;
      //Act
      try {
        await userService.findById(testId);
      } catch (err) {
        actual = err;
      }
      //Assert
      expect(actual.statusCode).to.equal(500);
    });

    //? US6-4
    it("should return undefined if findById resolves with undefined", async () => {
      //Arrange
      selectStub.resolves(undefined);

      //Act
      const actual = await userService.findById(testId);
      //Assert
      expect(actual).to.equal(undefined);
    });

    //? US6-4
    it("should return user if findById resolves with user doc", async () => {
      //Arrange
      selectStub.resolves(userData.documents[0]);

      //Act
      const actual = await userService.findById(testId);
      //Assert
      expect(actual).to.equal(userData.documents[0]);
    });
  });
  describe("Update By Id Tests", () => {
    const testPasswordUpdate = { password: "newPassword" };
    //?AS7-1
    it("should call findByIdAndUpdate on the user model with the correct arguments", async () => {
      //Arrange
      findByIdAndUpdateStub.resolves(userData.documents[0]);
      //Act
      await userService.updateById(testId, testPasswordUpdate);
      //expect
      expect(findByIdAndUpdateStub.calledWith(testId, testPasswordUpdate)).to.be
        .true;
    });

    //?AS7-2
    it("should throw a HTTPError with status of 500 where findByIdAndUpdate fails", async () => {
      //Arrange
      const expected = 500;
      let actual;
      findByIdAndUpdateStub.rejects(new Error());
      //Act
      try {
        await userService.updateById(testId, testPasswordUpdate);
      } catch (err) {
        actual = err.statusCode;
      }

      //expect
      expect(actual).to.equal(expected);
    });
  });
});
