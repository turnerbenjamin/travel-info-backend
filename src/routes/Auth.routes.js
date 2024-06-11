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
    this.#router.get("/", (req, res) => res.status(200).json("Hi"));
    this.#router.post(
      "/register",
      UserValidator.validate(),
      this.#authController.register
    );

    this.#router.post("/sign-in", this.#authController.signIn, signAndSendJWT);
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
