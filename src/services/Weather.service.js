import axios from "axios";

import HTTPError from "../utils/HTTPError.js";

export default class WeatherService {
  /**
   * Retrieves the weather forecast based on latitude and longitude.
   *
   * This method fetches the weather forecast data from the OpenWeatherMap API
   * for the specified latitude and longitude coordinates. The data is returned
   * in metric units.
   *
   * @param {number} latitude - The latitude coordinate for the location.
   * @param {number} longitude - The longitude coordinate for the location.
   * @returns {Promise<Object>} A promise that resolves to the weather forecast data.
   * @throws {HTTPError} Throws an HTTPError with a status code of 500 in case of a server error.
   */
  getWeather = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };
}
