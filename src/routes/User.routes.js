import { Router } from "express";

import LocationValidator from "../middleware/Location.validator.js";

export default class UserRoutes {
  #router;
  #root;
  #userController;
  #authController;

  constructor(root, authController, userController) {
    this.#router = Router();
    this.#root = root;
    this.#userController = userController;
    this.#authController = authController;
    this.#initialiseRoutes();
  }

  #initialiseRoutes() {
    this.#router.post(
      "/:userId/favourite-locations",
      this.#authController.validate,
      LocationValidator.validate(),
      this.#userController.addLocationToFavourites
    );

    this.#router.get(
      "/:userId/favourite-locations",
      this.#authController.validate,
      this.#userController.getUserFavouriteLocations
    );
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
