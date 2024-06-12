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
});
