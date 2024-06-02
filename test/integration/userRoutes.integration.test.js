import { expect } from "chai";
import express from "express";
import sinon from "sinon";
import supertest from "supertest";

import Config from "../../config/Config.js";
import Database from "../../src/database/Database.js";
import Location from "../../src/models/Location.model.js";
import locationData from "../data/location.test.data.js";
import LocationService from "../../src/services/Location.service.js";
import Server from "../../src/server/Server.js";
import User from "../../src/models/User.model.js";
import UserController from "../../src/controllers/User.controller.js";
import userData from "../data/user.test.data.js";
import UserRoutes from "../../src/routes/User.routes.js";
import UserService from "../../src/services/User.service.js";

describe("User routes: integration tests", () => {
  let server;
  let userService;
  let locationService;
  let database;
  let request;

  before(async () => {
    Config.load();

    userService = new UserService();
    locationService = new LocationService();
    const userController = new UserController(userService, locationService);
    const authController = {
      validate: (req, _, next) => {
        req.user = userData.documents[0];
        next();
      },
    };
    const userRoutes = new UserRoutes("/users", authController, userController);
    const { PORT, HOST, DB_URI } = process.env;
    const app = express();
    server = new Server(PORT, HOST, app, userRoutes);
    database = new Database(DB_URI);
    await database.connect();
    server.start();
    request = supertest(app);

    after(async () => {
      await server.close();
      await database.close();
    });
  });

  beforeEach(async () => {
    await User.insertMany(userData.documents);
    await Location.insertMany(locationData.documents);
  });

  afterEach(async () => {
    await User.deleteMany();
    await Location.deleteMany();
  });

  describe("Add location to favourites tests", () => {
    //? INT1-1
    it("should respond with a 201 status code with valid request", async () => {
      //Arrange
      const endpoint = `/users/${userData.documents[0]._id}/favourite-locations`;
      //Act
      const response = await request
        .post(endpoint)
        .send(locationData.submissions[0]);
      //Assert
      expect(response.status).to.equal(201);
    });

    //? INT1-2
    it("should add location to favourite locations", async () => {
      //Arrange
      const endpoint = `/users/${userData.documents[0]._id}/favourite-locations`;
      //Act
      const response = await request
        .post(endpoint)
        .send(locationData.submissions[0]);

      console.log("PRINTING");
      console.log(response.body);
      //Assert
      expect(response.body.FavouriteLocations).to.deep.equal([
        locationData.documents[0]._id.toString(),
      ]);
    });
  });
});
