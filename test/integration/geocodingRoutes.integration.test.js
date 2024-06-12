import { expect } from "chai";
import axios from "axios";
import express from "express";
import sinon from "sinon";
import supertest from "supertest";

import Config from "../../config/Config.js";
import Database from "../../src/database/Database.js";
import GeocodingController from "../../src/controllers/GeocodingController.js";
import GeocodingRoutes from "../../src/routes/Geocoding.routes.js";
import GeocodingService from "../../src/services/Geocoding.service.js";
import * as geocodingTestData from "../data/geocoding.test.data.js";
import Server from "../../src/server/Server.js";

describe("Geocoding routes integration tests", () => {
  const endpoint = "/geocoding";
  const testQuery = "Dublin";
  const testUrl = `${endpoint}/?searchTerm=${testQuery}`;

  let axiosGetStub;
  let request;
  let server;
  let database;

  before(async () => {
    Config.load();
    const geocodingService = new GeocodingService();
    const geocodingController = new GeocodingController(geocodingService);
    const geoCodingRoutes = new GeocodingRoutes(
      "/geocoding",
      geocodingController
    );
    const { PORT, HOST, DB_URI } = process.env;
    const app = express();
    server = new Server(PORT, HOST, app, [geoCodingRoutes]);
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
    axiosGetStub.resolves({ data: geocodingTestData.rawData });
  });

  afterEach(() => {
    axiosGetStub.restore();
  });

  //?INT8-1
  it("should respond with a status code of 200 if the request is successful", async () => {
    //Act
    const response = await request.get(testUrl);
    //Assert
    expect(response.status).to.equal(200);
  });

  //?INT8-2
  it("should respond with an array of location objects", async () => {
    //Act
    const response = await request.get(testUrl);
    //Assert
    expect(response.body).to.deep.equal(geocodingTestData.formattedData);
  });
});
