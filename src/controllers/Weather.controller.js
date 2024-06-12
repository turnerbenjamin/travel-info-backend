import HTTPError from "../utils/HTTPError.js";

export default class WeatherController {
  #weatherService;

  constructor(weatherService) {
    this.#weatherService = weatherService;
  }
  getWeather = async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const weatherData = await this.#weatherService.getWeather(
        latitude,
        longitude
      );
      res.status(200).json(weatherData);
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };
}
