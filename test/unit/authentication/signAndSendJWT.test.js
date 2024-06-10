import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import userData from "../../data/user.test.data.js";
import signAndSendJWT from "../../../src/middleware/SignAndSendJWT.js";

describe("User controller tests: ", () => {
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
      cookie: sinon.spy(),
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
      await signAndSendJWT(req, res);
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
  });
});
