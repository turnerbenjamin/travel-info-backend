export default class WeatherController {
  #weatherService;

  constructor(weatherService) {
    this.#weatherService = weatherService;
  }
  getWeather = async (req) => {
    const { latitude, longitude } = req.query;
    await this.#weatherService.getWeather(latitude, longitude);
  };
}
