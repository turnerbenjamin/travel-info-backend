import { expect } from "chai";
import express from "express";
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
  const endpoint = `/auth/register`;

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
      const response = await request.post(endpoint).send(newUserSubmission);
      //Assert
      expect(response.status).to.equal(201);
    });

    //? INT4-2
    it("should have an empty response body where successful", async () => {
      //Act
      const response = await request.post(endpoint).send(newUserSubmission);
      //Assert
      expect(response.body).to.be.empty;
    });
  });
});
