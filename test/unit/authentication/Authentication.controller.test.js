import { expect } from "chai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import AuthenticationController from "../../../src/controllers/Authentication.controller.js";
import HTTPError from "../../../src/utils/HTTPError.js";
import userData from "../../data/user.test.data.js";

describe("User controller tests: ", () => {
  const testUser = userData.submissions[0];
  const testUserEmail = userData.submissions[0].emailAddress;
  const testUserPassword = userData.submissions[0].password;
  const testHashedPassword = "hashedPassword";
  let authenticationController;
  let userService;
  let hashStub;
  let compareStub;
  let req;
  let res;
  let next;
  let verifyStub;

  beforeEach(() => {
    hashStub = sinon.stub(bcrypt, "hash");
    hashStub.resolves(testHashedPassword);
    compareStub = sinon.stub(bcrypt, "compare");
    verifyStub = sinon.stub(jwt, "verify");
    userService = {
      createUser: sinon.stub(),
      findByEmailAddress: sinon.stub(),
      findById: sinon.stub(),
      updateById: sinon.stub(),
    };

    authenticationController = new AuthenticationController(userService);
    req = {
      body: userData.submissions[0],
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    authenticationController = null;
    userService = null;
    hashStub.restore();
    compareStub.restore();
    verifyStub.restore();
    req = null;
    res = null;
    next = null;
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

    //? AC4-3
    it("should respond with a status of 400 if the User service throws a HTTP error with a status of 400", async () => {
      //Arrange
      const testError = new HTTPError(
        400,
        "A user with this email already exists"
      );
      userService.createUser.rejects(testError);
      //Act
      await authenticationController.register(req, res);
      //Assert
      expect(res.status.calledWith(400)).to.be.true;
    });

    //? AC4-4
    it("should respond with a status code of 500 if the User service throws an error without a status code of 400", async () => {
      //Arrange
      userService.createUser.rejects(new Error());
      //Act
      await authenticationController.register(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? AC4-5
    it("should respond with a 201 status if the user was created successfully", async () => {
      //Arrange
      const testId = userData.documents[0]._id;
      userService.createUser.resolves(testId);
      //Act
      await authenticationController.register(req, res);
      //Assert
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(undefined)).to.be.true;
    });
  });

  describe("signIn tests", () => {
    //? AC5-1
    it("should call findByEmailAddress on the User Service", async () => {
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(userService.findByEmailAddress.calledWith(testUserEmail)).to.be
        .true;
    });

    //? AC5-2
    it("should respond with a 401 error if User Service returns null", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(null);
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(res.status.calledWith(401)).to.be.true;
    });

    //? AC5-3
    it("should respond with a 500 error if User Service fails", async () => {
      //Arrange
      userService.findByEmailAddress.rejects(new Error());
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? AC5-4
    it("should call compare on bcrypt with the correct arguments", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(userData.documents[0]);
      const expectedArguments = [
        userData.submissions[0].password,
        userData.documents[0].password,
      ];
      //Act
      await authenticationController.signIn(req, res, next);
      const actualArguments = compareStub.getCall(0).args;
      //Assert
      expect(actualArguments).to.deep.equal(expectedArguments);
    });

    //? AC5-5
    it("should respond with a 401 error if bcrypt returns false", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(userData.documents[0]);
      compareStub.resolves(false);
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(res.status.calledWith(401)).to.be.true;
    });

    //? AC5-6
    it("should respond with a 500 error if bcrypt rejects", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(userData.documents[0]);
      compareStub.rejects();
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? AC5-7
    it("should attach the User object, without the password, to req if bcrypt returns true", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(userData.documents[0]);
      const expected = { ...userData.documents[0] };
      delete expected.password;
      compareStub.resolves(true);
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(req.user).to.deep.equal(expected);
    });

    //? AC5-8
    it("should call next if bcrypt returns true", async () => {
      //Arrange
      userService.findByEmailAddress.resolves(userData.documents[0]);
      compareStub.resolves(true);
      //Act
      await authenticationController.signIn(req, res, next);
      //Assert
      expect(next.called).to.be.true;
    });
  });
  describe("signIn tests", () => {
    const testJWT = { _id: "test_id" };

    beforeEach(() => {
      req.cookies = {
        jwt: testJWT,
      };
    });

    //? AC6-1
    it("should respond with status code of 401 if no req.cookie.jwt", async () => {
      //Arrange
      req.cookies = undefined;
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(res.status.calledWith(401)).to.be.true;
    });

    //? AC6-2
    it("should call jwt.verify with correct arguments", async () => {
      //Arrange
      verifyStub.returns(testJWT);
      const expectedJWTArg = req.cookies.jwt;
      const expectedSecretArg = process.env.JWT_SECRET_KEY;
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      const [actualJWTArg, actualSecretArg] = verifyStub.getCall(0).args;
      //Assert
      expect(actualJWTArg).to.equal(expectedJWTArg);
      expect(actualSecretArg).to.equal(expectedSecretArg);
    });

    //? AC6-3
    it("should respond with a status code of 500 if verify rejects", async () => {
      //Arrange
      verifyStub.throws();
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? AC6-4
    it("should call getUserById on User Service with correct id if verify resolves", async () => {
      //Arrange
      verifyStub.returns(testJWT);
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(userService.findById.calledWith(testJWT._id)).to.be.true;
    });

    //? AC6-5
    it("should respond with status code of 500 if User Service rejects", async () => {
      //Arrange
      userService.findById.rejects();
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? AC6-6
    it("should respond with status code of 401 if User Service returns undefined", async () => {
      //Arrange
      verifyStub.returns(testJWT);
      userService.findById.resolves(undefined);
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(res.status.calledWith(401)).to.be.true;
    });

    //? AC6-7
    it("should attach user to request object us User Service resolves", async () => {
      //Arrange
      const expected = { ...userData.documents[0] };
      delete expected.password;
      verifyStub.returns(testJWT);
      userService.findById.resolves(userData.documents[0]);
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(req.user).to.deep.equal(expected);
    });

    //? AC6-8
    it("should attach user to request object us User Service resolves", async () => {
      //Arrange
      verifyStub.returns(testJWT);
      userService.findById.resolves(userData.documents[0]);
      //Act
      await authenticationController.requireLoggedIn()(req, res, next);
      //Assert
      expect(next.calledOnce).to.be.true;
    });
  });

  describe("Update password tests", () => {
    const testJWT = { _id: "test_id" };
    const testUpdatedPassword = "newPassword";
    const testHashedUpdatedPassword = "hashedNewPassword";

    beforeEach(() => {
      req.cookies = {
        jwt: testJWT,
      };
      req.body.password = testUserPassword;
      req.body.updatedPassword = testUpdatedPassword;
    });

    describe("Require log in tests:", () => {
      //?AC7-1
      it("It should call findById on the user service with the correct arguments", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(userService.findById.calledWith(testJWT._id, true)).to.be.true;
      });

      //?AC7-2
      it("It should respond with status code of 500 where findById fails", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        userService.findById.rejects(new Error());
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(res.status.calledWith(500)).to.be.true;
      });

      //?AC7-3
      it("It should call compare on bcrypt with the correct arguments", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        userService.findById.resolves(testUser);
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(compareStub.calledWith(testUserPassword, testUserPassword)).to.be
          .true;
      });

      //?AC7-4
      it("It should call compare on bcrypt with the correct arguments", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        userService.findById.resolves(testUser);
        compareStub.returns(false);
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(res.status.calledWith(401)).to.be.true;
      });

      //?AC7-5
      it("It should respond with a 500 error if bcrypt rejects", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        userService.findById.resolves(testUser);
        compareStub.throws();
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(res.status.calledWith(500)).to.be.true;
      });

      //?AC7-6
      it("should call next if bcrypt returns true", async () => {
        //Arrange
        verifyStub.returns(testJWT);
        userService.findById.resolves(testUser);
        compareStub.returns(true);
        //Act
        await authenticationController.requireLoggedIn({
          requirePassword: true,
        })(req, res, next);
        //Assert
        expect(next.calledWith()).to.be.true;
      });
    });

    describe("Update password tests", () => {
      const testUserId = "testUserId";
      beforeEach(() => {
        req.user = { ...testUser, _id: testUserId };
      });

      //?AC7-7
      it("It should call hash on bcrypt with the new password", async () => {
        //Act
        await authenticationController.updatePassword(req, res, next);
        //Assert
        expect(hashStub.calledWith(testUpdatedPassword)).to.be.true;
      });

      //?AC7-8
      it("should respond with a 500 error if hash fails", async () => {
        //Arrange
        hashStub.rejects();
        //Act
        await authenticationController.updatePassword(req, res, next);
        //Assert
        expect(res.status.calledWith(500)).to.be.true;
      });

      //?AC7-9
      it("should call updateById on the User Service with the correct arguments", async () => {
        //Arrange
        hashStub.resolves(testHashedPassword);
        //Act
        await authenticationController.updatePassword(req, res, next);
        const [actualUserIdArg, actualUpdateArg] =
          userService.updateById.getCall(0).args;
        //Assert
        expect(actualUserIdArg).to.equal(testUserId);
        expect(actualUpdateArg).to.deep.equal({ password: testHashedPassword });
      });

      //?AC7-10
      it("should respond with a 500 error if User Service fails", async () => {
        //Arrange
        hashStub.resolves(testHashedPassword);
        userService.updateById.rejects();
        //Act
        await authenticationController.updatePassword(req, res, next);
        //Assert
        expect(res.status.calledWith(500)).to.be.true;
      });

      //?AC7-11
      it("should respond with a status code of 200 if User updated successfully", async () => {
        //Arrange
        hashStub.resolves(testHashedPassword);
        userService.updateById.resolves();
        //Act
        await authenticationController.updatePassword(req, res, next);
        //Assert
        expect(res.status.calledWith(200)).to.be.true;
      });

      //?AC7-12
      it("should respond with a the updated user document", async () => {
        //Arrange
        hashStub.resolves(testHashedPassword);
        userService.updateById.resolves(testUser);
        //Act
        await authenticationController.updatePassword(req, res, next);
        //Assert
        expect(res.json.calledWith(testUser)).to.be.true;
      });
    });
  });
});
