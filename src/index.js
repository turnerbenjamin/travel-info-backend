import express from "express";

import AuthenticationController from "./controllers/Authentication.controller.js";
import AuthRoutes from "./routes/Auth.routes.js";
import Config from "../config/Config.js";
import Database from "./database/Database.js";
import FavouritedLocationService from "./services/FavouritedLocation.service.js";
import GeocodingController from "./controllers/GeocodingController.js";
import GeocodingRoutes from "./routes/Geocoding.routes.js";
import GeocodingService from "./services/Geocoding.service.js";
import LocationService from "./services/Location.service.js";
import Server from "./server/Server.js";
import UserController from "./controllers/User.controller.js";
import UserRoutes from "./routes/User.routes.js";
import UserService from "./services/User.service.js";
import WeatherController from "./controllers/Weather.controller.js";
import WeatherRoutes from "./routes/Weather.routes.js";
import WeatherService from "./services/Weather.service.js";

Config.load();

//?Initialise services
const favouriteLocationService = new FavouritedLocationService();
const locationService = new LocationService();
const userService = new UserService();
const geocodingService = new GeocodingService();
const weatherService = new WeatherService();

//?Initialise controllers
const authenticationController = new AuthenticationController(userService);
const userController = new UserController(
  favouriteLocationService,
  locationService
);
const geocodingController = new GeocodingController(geocodingService);
const weatherController = new WeatherController(weatherService);

//?Initialise routes
const userRoutes = new UserRoutes(
  "/users",
  authenticationController,
  userController
);
const authRoutes = new AuthRoutes("/auth", authenticationController);
const geocodingRoutes = new GeocodingRoutes("/geocoding", geocodingController);
const weatherRoutes = new WeatherRoutes("/weather", weatherController);

//?Start server
const { PORT, HOST, DB_URI } = process.env;
const app = express();
const server = new Server(PORT, HOST, app, [
  authRoutes,
  userRoutes,
  geocodingRoutes,
  weatherRoutes,
]);
server.start();

//?Connect to database
const database = new Database(DB_URI);
await database.connect();
