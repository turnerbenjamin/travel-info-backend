import { Router } from "express";

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
    this.#router.post("/register", this.#authController.register);
  }

  getRouter() {
    return this.#router;
  }

  getRoot() {
    return this.#root;
  }
}
