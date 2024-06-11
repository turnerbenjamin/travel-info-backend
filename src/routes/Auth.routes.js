import { Router } from "express";

import UserValidator from "../middleware/User.validator.js";
import signAndSendJWT from "../middleware/signAndSendJWT.js";

export default class AuthRoutes {
  #router;
  #root;
  #authController;

  constructor(root, authController) {
    this.#router = Router();
    this.#root = root;
    this.#authController = authController;
    this.#initialiseRoutes();
  }

  #initialiseRoutes() {
    this.#router.post(
      "/register",
      UserValidator.validate(),
      this.#authController.register
    );
    this.#router.post("/sign-in", this.#authController.signIn, signAndSendJWT);
    this.#router.post(
      "/update-password",
      this.#authController.requireLoggedIn({ requirePassword: true }),
      this.#authController.updatePassword
    );
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
