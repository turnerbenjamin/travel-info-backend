import { expect } from "chai";
import express from "express";
import sinon from "sinon";
import supertest from "supertest";

import Config from "../../config/Config.js";
import Database from "../../src/database/Database.js";
import FavouritedLocationService from "../../src/services/FavouritedLocation.service.js";
import Location from "../../src/models/Location.model.js";
import locationData from "../data/location.test.data.js";
import LocationService from "../../src/services/Location.service.js";
import Server from "../../src/server/Server.js";
import User from "../../src/models/User.model.js";
import UserController from "../../src/controllers/User.controller.js";
import userData from "../data/user.test.data.js";
import UserRoutes from "../../src/routes/User.routes.js";

describe("User routes: integration tests", () => {
  let server;
  let favouriteLocationService;
  let locationService;
  let database;
  let request;

  before(async () => {
    Config.load();

    favouriteLocationService = new FavouritedLocationService();
    locationService = new LocationService();
    const userController = new UserController(
      favouriteLocationService,
      locationService
    );
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

  //Replaces auto-generated ids with those
  //in results for the purpose of comparing results
  const mirrorIds = (expected, result) => {
    result.forEach((resultDoc, i) => {
      resultDoc._id = expected[i]._id;
    });
  };

  describe("Add location to favourites tests", () => {
    const endpoint = `/users/${userData.documents[0]._id}/favourite-locations`;
    const validLocationSubmission = locationData.submissions[0];
    let newLocation;

    beforeEach(() => {
      newLocation = {
        label: "Edinburgh",
        latitude: 55.95380035447052,
        longitude: -3.1862843385342554,
      };
    });

    afterEach(() => {
      newLocation = null;
    });

    //? INT1-1
    it("should respond with a 201 status code with valid request", async () => {
      //Act
      const response = await request
        .post(endpoint)
        .send(validLocationSubmission);
      //Assert
      expect(response.status).to.equal(201);
    });

    //? INT1-2
    it("should add location to favourite locations", async () => {
      //Arrange
      const expected = locationData.formattedResponses;
      //Act
      await request.post(endpoint).send(validLocationSubmission);
      const response = await request
        .post(endpoint)
        .send(locationData.submissions[1]);

      mirrorIds(expected, response.body);
      //Assert
      expect(response.body).to.deep.equal(expected);
    });

    //? INT1-3
    it("should set response content type to JSON", async () => {
      //Act
      const response = await request
        .post(endpoint)
        .send(validLocationSubmission);
      //Assert
      expect(response.headers["content-type"]).to.include("application/json");
    });

    //? INT1-4
    it("should return 500 status code where error thrown", async () => {
      //Arrange
      const stub = sinon.stub(Location, "findOne");
      stub.rejects(new Error());
      //Act
      const response = await request
        .post(endpoint)
        .send(validLocationSubmission);
      //Assert
      expect(response.status).to.equal(500);
      //Clean-up
      stub.restore();
    });

    //? INT1-5
    it("should return 400 status code where label missing", async () => {
      //Arrange
      delete newLocation.label;
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT1-6
    it("should return 400 status code where label empty", async () => {
      //Arrange
      newLocation.label = "  ";
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT1-7
    it("should return 400 status code where latitude missing", async () => {
      //Arrange
      delete newLocation.latitude;
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT1-8
    it("should return 400 status code where latitude missing", async () => {
      //Arrange
      newLocation.latitude = "x";
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT1-9
    it("should return 400 status code where longitude missing", async () => {
      //Arrange
      delete newLocation.longitude;
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });

    //? INT1-10
    it("should return 400 status code where longitude not numeric", async () => {
      //Arrange
      newLocation.longitude = "Z";
      //Act
      const response = await request.post(endpoint).send(newLocation);
      //Assert
      expect(response.status).to.equal(400);
    });
  });
});