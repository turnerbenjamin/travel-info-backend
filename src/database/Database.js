import mongoose from "mongoose";

export default class Database {
  #uri;

  constructor(uri) {
    this.#uri = uri;
  }

  /**
   * Establishes a connection to the database using the MongoDB URI stored in the instance.
   * Logs a success message upon successful connection or an error message if the connection fails.
   */
  async connect() {
    try {
      await mongoose.connect(this.#uri);
      console.log(`Connected to database (${this.#uri})`);
    } catch (error) {
      console.error("Database connection error", error);
    }
  }

  /**
   * Closes the connection to the database.
   * This should be called to gracefully shut down the connection when the application is terminating.
   */
  async close() {
    await mongoose.disconnect();
  }
}
