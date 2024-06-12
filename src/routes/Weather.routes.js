import { Router } from "express";

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
    this.#router.get("/", this.#weatherController.getWeather);
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
