import { config } from "dotenv";
import path from "path";

export default class Config {
  static #env = process.env.NODE_ENV;
  static #configPath = path.resolve(process.cwd(), "config");

  static #getEnvFileName() {
    if (this.#env !== "dev" && this.#env !== "test") return ".env";
    return `.env.${Config.#env}`;
  }

  static load() {
    const envPath = path.resolve(Config.#configPath, this.#getEnvFileName());
    config({ path: envPath });
  }
}
