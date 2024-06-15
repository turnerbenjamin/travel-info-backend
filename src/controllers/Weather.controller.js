export default class WeatherController {
  #weatherService;

  constructor(weatherService) {
    this.#weatherService = weatherService;
  }

  /**
   * Asynchronously retrieves weather data based on latitude and longitude provided in the request query.
   * Responds with the weather data in JSON format if successful, or a 500 status code with a "Server Error" message if an error occurs.
   *
   * @param {Object} req - The request object, expected to contain `query` with `latitude` and `longitude` properties.
   * @param {Object} res - The response object, used to send back the retrieved weather data or an error message.
   */
  getWeather = async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const weatherData = await this.#weatherService.getWeather(
        latitude,
        longitude
      );
      res.status(200).json(weatherData);
    } catch (err) {
      res.status(500).json("Server Error");
    }
  };
}
