import axios from "axios";

import HTTPError from "../utils/HTTPError.js";

export default class GeocodingService {
  /**
   * Retrieves up to 5 location results from the OpenWeatherMap Geocoding API for a given search term,
   * specifically within Great Britain.
   * @param {string} searchTerm - The city or location name to search for.
   * @returns {Promise<Object[]>} A promise that resolves to an array of location objects.
   * @throws {HTTPError} Throws an HTTPError with status 500 if the request fails.
   */
  getLocations = async (searchTerm) => {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm},,GB&limit=5&appid=${process.env.OPEN_WEATHER_API_KEY}`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw new HTTPError(500, "Server error");
    }
  };
}
