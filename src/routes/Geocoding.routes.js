import { Router } from "express";

import GeocodingQueryValidator from "../middleware/Geocoding.query.validator.js";

export default class GeocodingRoutes {
  #router;
  #root;
  #geoCodingController;

  constructor(root, geoCodingController) {
    this.#router = Router();
    this.#root = root;
    this.#geoCodingController = geoCodingController;
    this.#initialiseRoutes();
  }

  #initialiseRoutes() {
    this.#router.get(
      "/",
      GeocodingQueryValidator.validate(),
      this.#geoCodingController.getLocations
    );
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
