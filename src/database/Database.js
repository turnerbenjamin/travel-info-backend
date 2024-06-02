import mongoose from "mongoose";

export default class Database {
  #uri;

  constructor(uri) {
    this.#uri = uri;
  }

  async connect() {
    try {
      await mongoose.connect(this.#uri);
      console.log(`Connected to database (${this.#uri})`);
    } catch (error) {
      console.error("Database connection error", error);
    }
  }

  async close() {
    await mongoose.disconnect();
  }
}
