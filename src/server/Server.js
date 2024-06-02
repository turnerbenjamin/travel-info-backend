import express from "express";

export default class Server {
  #app;
  #host;
  #port;
  #server;
  #route;

  constructor(port, host, app, route) {
    this.#app = app;
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#route = route;
  }

  start() {
    this.#app.use(express.json());
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`Server is listening on http://${this.#host}/${this.#port}`);
    });
    this.#app.use(this.#route.getRoot(), this.#route.getRouter());
  }

  close() {
    this.#server?.close();
  }
}
