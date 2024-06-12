import axios from "axios";

import HTTPError from "../utils/HTTPError.js";

export default class WeatherService {
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
