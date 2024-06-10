import { expect } from "chai";
import bcrypt from "bcrypt";
import express from "express";
import sinon from "sinon";
import supertest from "supertest";

import AuthController from "../../src/controllers/Authentication.controller.js";
import AuthRoutes from "../../src/routes/Auth.routes.js";
import Config from "../../config/Config.js";
import Database from "../../src/database/Database.js";
import Server from "../../src/server/Server.js";
import UserService from "../../src/services/User.service.js";
import userData from "../data/user.test.data.js";
import User from "../../src/models/User.model.js";

describe("User routes: integration tests", () => {
  let server;
  let userService;
  let database;
  let request;
  let newUserSubmission;
  const registerEndpoint = `/auth/register`;
  const signInEndpoint = `/auth/sign-in`;

  before(async () => {
    Config.load();
    userService = new UserService();
    const authController = new AuthController(userService);

    const authRoutes = new AuthRoutes("/auth", authController);
    const { PORT, HOST, DB_URI } = process.env;
    const app = express();
    server = new Server(PORT, HOST, app, authRoutes);
    database = new Database(DB_URI);
    await database.connect();
    server.start();
    request = supertest(app);
  });

  after(async () => {
    await server.close();
    await database.close();
  });

  beforeEach(() => {
    newUserSubmission = { ...userData.submissions[0] };
  });

  afterEach(async () => {
    newUserSubmission = null;
    await User.deleteMany();
  });

  describe("Register user tests", () => {
    //? INT4-1
    it("should respond with a 201 status code with valid request", async () => {
      //Act
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(201);
    });

    //? INT4-2
    it("should have an empty response body where successful", async () => {
      //Act
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.body).to.be.empty;
    });

    //? INT4-3
    it("should respond with a 400 response if email address missing", async () => {
      //Act
      newUserSubmission.emailAddress = null;
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT4-4
    it("should respond with a 400 response if email is invalid", async () => {
      //Act
      newUserSubmission.emailAddress = "invalid@email";
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT4-5
    it("should respond with a 400 response if password is missing", async () => {
      //Act
      newUserSubmission.password = null;
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT4-6
    it("should respond with a 400 response if password is less than 8 chars long", async () => {
      //Act
      newUserSubmission.password = "1234567";
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT4-7
    it("should respond with a 400 response if user email is duplicated", async () => {
      //Arrange
      await request.post(registerEndpoint).send(newUserSubmission);
      //Act
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT4-8
    it("should respond with a 500 response create fails", async () => {
      //Arrange
      const stub = sinon.stub(User, "create");
      stub.rejects(new Error());
      //Act
      const response = await request
        .post(registerEndpoint)
        .send(newUserSubmission);
      stub.restore();
      //Assert
      expect(response.status).to.equal(500);
    });

    //? INT4-9
    it("should create the user in the database", async () => {
      //Act
      await request.post(registerEndpoint).send(newUserSubmission);
      const newUser = await User.findOne({
        emailAddress: newUserSubmission.emailAddress,
      });
      //Assert
      expect(newUser.emailAddress).to.equal(newUserSubmission.emailAddress);
    });

    //? INT4-10
    it("should not include password field in doc returned from database by default", async () => {
      //Act
      await request.post(registerEndpoint).send(newUserSubmission);
      const newUser = await User.findOne({
        emailAddress: newUserSubmission.emailAddress,
      });
      //Assert
      expect(newUser.password).to.equal(undefined);
    });

    //? INT4-11
    it("should store hashed password", async () => {
      //Act
      await request.post(registerEndpoint).send(newUserSubmission);
      const newUser = await User.findOne({
        emailAddress: newUserSubmission.emailAddress,
      }).select("password");
      //Assert
      expect(newUser.password).not.to.equal(newUserSubmission.password);
    });
  });
  describe("Sign in user tests", () => {
    //? INT5-1
    it("should respond with a 200 status code with valid request", async () => {
      //Arrange
      await request.post(registerEndpoint).send(newUserSubmission);
      //Act
      const response = await request
        .post(signInEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(200);
    });

    //? INT5-2
    it("should include res.user in the body of a success response", async () => {
      //Arrange
      await request.post(registerEndpoint).send(newUserSubmission);
      const userDoc = await User.findOne({
        emailAddress: newUserSubmission.emailAddress,
      });
      const expected = {
        _id: userDoc._id.toString(),
        emailAddress: userDoc.emailAddress,
      };

      //Act
      const response = await request
        .post(signInEndpoint)
        .send(newUserSubmission);
      //Assert
      expect(response.body).to.deep.equal(expected);
    });
  });
});
