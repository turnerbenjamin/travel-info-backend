import HTTPError from "../utils/HTTPError.js";

export default class WeatherController {
  #weatherService;

  constructor(weatherService) {
    this.#weatherService = weatherService;
  }
  getWeather = async (req) => {
    try {
      const { latitude, longitude } = req.query;
      await this.#weatherService.getWeather(latitude, longitude);
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };
}
