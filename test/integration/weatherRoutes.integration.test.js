import { expect } from "chai";
import axios from "axios";
import express from "express";
import sinon from "sinon";
import supertest from "supertest";

import Config from "../../config/Config.js";
import Database from "../../src/database/Database.js";
import WeatherController from "../../src/controllers/Weather.controller.js";
import WeatherRoutes from "../../src/routes/Weather.routes.js";
import WeatherService from "../../src/services/Weather.service.js";
import weatherTestData from "../data/weatherService.test.data.js";
import Server from "../../src/server/Server.js";

describe("Geocoding routes integration tests", () => {
  const endpoint = "/weather";
  const testLatitude = 51.5073219;
  const testLongitude = -0.1276474;
  const testUrl = `${endpoint}/?latitude=${testLatitude}&longitude=${testLongitude}`;

  let axiosGetStub;
  let request;
  let server;
  let database;

  before(async () => {
    Config.load();
    const weatherService = new WeatherService();
    const weatherController = new WeatherController(weatherService);
    const weatherRoutes = new WeatherRoutes("/weather", weatherController);
    const { PORT, HOST, DB_URI } = process.env;
    const app = express();
    server = new Server(PORT, HOST, app, [weatherRoutes]);
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
    axiosGetStub = sinon.stub(axios, "get");
    axiosGetStub.resolves({ data: weatherTestData });
  });

  afterEach(() => {
    axiosGetStub.restore();
  });

  //?INT9-1
  it("should respond with a status code of 200 if the request is successful", async () => {
    //Act
    const response = await request.get(testUrl);
    //Assert
    expect(response.status).to.equal(200);
  });

  //?INT9-2
  it("should respond with a weather forecast object", async () => {
    //Act
    const response = await request.get(testUrl);
    //Assert
    expect(response.body).to.deep.equal(weatherTestData);
  });

  //?INT9-3
  it("should respond with a status code of 500 if the request fails", async () => {
    //Arrange
    axiosGetStub.rejects();
    //Act
    const response = await request.get(testUrl);
    //Assert
    expect(response.status).to.equal(500);
  });

  //?INT9-4
  it("should respond with a status code of 400 if latitude missing", async () => {
    //Arrange
    const emptyLatitude = "  ";
    const invalidURL = `${endpoint}/?latitude=${emptyLatitude}&longitude=${testLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  //?INT9-5
  it("should respond with a status code of 400 if latitude not numeric", async () => {
    //Arrange
    const nonNumericLatitude = "abc";
    const invalidURL = `${endpoint}/?latitude=${nonNumericLatitude}&longitude=${testLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  //?INT9-6
  it("should respond with a status code of 400 if longitude missing", async () => {
    //Arrange
    const emptyLongitude = "  ";
    const invalidURL = `${endpoint}/?latitude=${testLatitude}&longitude=${emptyLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  //?INT9-7
  it("should respond with a status code of 400 if longitude not numeric", async () => {
    //Arrange
    const nonNumericLongitude = "abc";
    const invalidURL = `${endpoint}/?latitude=${testLatitude}&longitude=${nonNumericLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  //?The following tests relate to a copilot suggestion to test the range of latitude and longitude
  it("should respond with a status code of 400 if latitude is greater than 90", async () => {
    //Arrange
    const invalidLatitude = 90.1;
    const invalidURL = `${endpoint}/?latitude=${invalidLatitude}&longitude=${testLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  it("should respond with a status code of 400 if latitude is less than -90", async () => {
    //Arrange
    const invalidLatitude = -90.1;
    const invalidURL = `${endpoint}/?latitude=${invalidLatitude}&longitude=${testLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  it("should respond with a status code of 400 if latitude is greater than 180", async () => {
    //Arrange
    const invalidLongitude = 180.1;
    const invalidURL = `${endpoint}/?latitude=${testLatitude}&longitude=${invalidLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });

  it("should respond with a status code of 400 if latitude is less than -180", async () => {
    //Arrange
    const invalidLongitude = -180.1;
    const invalidURL = `${endpoint}/?latitude=${testLatitude}&longitude=${invalidLongitude}`;
    //Act
    const response = await request.get(invalidURL);
    //Assert
    expect(response.status).to.equal(400);
  });
});
