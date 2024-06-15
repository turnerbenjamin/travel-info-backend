import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

export default class Server {
  #app;
  #host;
  #port;
  #server;
  #routes;

  constructor(port, host, app, routes) {
    this.#app = app;
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#routes = routes;
  }

  /**
   * Starts the server by initializing middleware, routes, and then listening on the specified port and host.
   * It logs the environment and the address the server is listening on.
   */
  start() {
    this.#initialiseAppMiddleware();
    this.#initialiseRoutes();
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  }

  /**
   * Closes the server if it is running. This is useful for gracefully shutting down the server.
   */
  close() {
    this.#server?.close();
  }

  #initialiseAppMiddleware = () => {
    this.#app.use(express.json());
    this.#app.use(cookieParser());
    this.#app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:5173"],
      })
    );
  };

  #initialiseRoutes = () => {
    this.#routes.forEach((route) => {
      this.#app.use(route.getRoot(), route.getRouter());
    });
  };
}
