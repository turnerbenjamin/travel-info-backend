import { Router } from "express";

import WeatherQueryValidator from "../middleware/Weather.query.validator.js";

export default class WeatherRoutes {
  #router;
  #root;
  #weatherController;

  constructor(root, weatherController) {
    this.#router = Router();
    this.#root = root;
    this.#weatherController = weatherController;
    this.#initialiseRoutes();
  }

  #initialiseRoutes() {
    this.#router.get(
      "/",
      WeatherQueryValidator.validate(),
      this.#weatherController.getWeather
    );
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
