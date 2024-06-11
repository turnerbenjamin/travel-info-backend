import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import userData from "../../data/user.test.data.js";
import signAndSendJWT from "../../../src/middleware/signAndSendJWT.js";

describe("Sign and Send JWT Tests: ", () => {
  const testUser = userData.documents[0];
  let signStub;
  let req;
  let res;

  beforeEach(() => {
    signStub = sinon.stub(jwt, "sign");
    req = {
      user: userData.documents[0],
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      cookie: sinon.stub(),
    };
  });

  afterEach(() => {
    signStub.restore();
    req = null;
    res = null;
  });

  describe("SignAndSendJWT tests", () => {
    //? JWT5-1
    it("should call sign on jwt with the correct arguments", async () => {
      //Arrange
      const expectedJWTBody = { _id: testUser._id };
      const expectedSecretKey = process.env.JWT_SECRET_KEY;
      const expectedOptions = { expiresIn: process.env.JWT_EXPIRES_IN };
      //Act
      signAndSendJWT(req, res);
      //Assert
      const [actualJWTBody, actualSecretKey, actualOptions] =
        signStub.getCall(0).args;
      expect(actualJWTBody).to.deep.equal(expectedJWTBody);
      expect(actualSecretKey).to.equal(expectedSecretKey);
      expect(actualOptions).to.deep.equal(expectedOptions);
    });

    //? JWT5-2
    it("should respond with a 500 error if sign fails", async () => {
      //Arrange
      signStub.throws(new Error());
      //Act
      signAndSendJWT(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? JWT5-3
    it("should call res.cookie with valid arguments", async () => {
      //Arrange
      const testToken = "testToken";
      signStub.returns(testToken);
      const expectedCookieName = "jwt";
      const expectedToken = testToken;
      const expectedOptions = {
        maxAge: process.env.COOKIE_EXPIRES_IN,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
      };
      //Act
      signAndSendJWT(req, res);
      const [actualCookieName, actualToken, actualOptions] =
        res.cookie.getCall(0).args;
      //Assert
      expect(actualCookieName).to.equal(expectedCookieName);
      expect(actualToken).to.equal(expectedToken);
      expect(actualOptions).to.deep.equal(expectedOptions);
    });

    //? JWT5-4
    it("should respond with a 500 error if cookie method fails", async () => {
      //Arrange
      res.cookie.throws(new Error());
      //Act
      signAndSendJWT(req, res);
      //Assert
      expect(res.status.calledWith(500)).to.be.true;
    });

    //? JWT5-5
    it("should respond with a 200 status code", async () => {
      //Act
      signAndSendJWT(req, res);
      //Assert
      expect(res.status.calledWith(200)).to.be.true;
    });

    //? JWT5-6
    it("should include res.user in the body of a success response", async () => {
      //Arrange
      const expected = req.user;
      //Act
      signAndSendJWT(req, res);
      //Assert
      expect(res.json.calledWith(expected)).to.be.true;
    });
  });
});
